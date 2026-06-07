const NOTION_VERSION = '2022-06-28';

const serviceLabels = {
  preventive: 'Preventive Dentistry',
  childrens: "Children's Dentistry",
  cosmetic: 'Cosmetic Dentistry',
  implants: 'Dental Implants',
  rootcanal: 'Root Canal Therapy',
  periodontal: 'Periodontal Therapy',
  veneers: 'Porcelain Veneers',
  whitening: 'Teeth Whitening',
  dentures: 'Dentures & Bridges',
  general: 'General Consultation',
};

const timeLabels = {
  '9am': '9:00 AM - 10:00 AM',
  '10am': '10:00 AM - 11:00 AM',
  '11am': '11:00 AM - 12:00 PM',
  '12pm': '12:00 PM - 1:00 PM',
  '1pm': '1:00 PM - 2:00 PM',
  '2pm': '2:00 PM - 3:00 PM',
  '3pm': '3:00 PM - 4:00 PM',
  '4pm': '4:00 PM - 5:00 PM',
  '5pm': '5:00 PM - 6:00 PM',
};

export default async function handler(req, res) {
  res.setHeader('Allow', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let appointment;

  try {
    appointment = normalizeAppointment(await readRequestBody(req));
  } catch (error) {
    console.error('Appointment payload error:', error);
    return res.status(400).json({ error: 'Invalid appointment request.' });
  }

  const validationError = validateAppointment(appointment);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const results = {
    notion: false,
    telegram: false,
  };

  const notionConfigured = Boolean(process.env.NOTION_TOKEN && process.env.NOTION_DATABASE_ID);
  const telegramConfigured = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID,
  );

  if (!notionConfigured && !telegramConfigured) {
    console.error('Appointment integrations are not configured.');
    return res.status(503).json({
      error:
        'Appointment service is not configured locally. Add the integration variables to .env, then restart the dev server.',
    });
  }

  if (notionConfigured) {
    try {
      await addToNotion(appointment);
      results.notion = true;
    } catch (error) {
      console.error('Notion integration failed:', getErrorMessage(error));
    }
  }

  if (telegramConfigured) {
    try {
      await sendToTelegram(appointment);
      results.telegram = true;
    } catch (error) {
      console.error('Telegram integration failed:', getErrorMessage(error));
    }
  }

  if (!results.notion && !results.telegram) {
    return res.status(502).json({
      error: 'Unable to submit appointment right now. Please call the clinic.',
      results,
    });
  }

  return res.status(200).json({ success: true, results });
}

async function readRequestBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body);
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');
  return rawBody ? JSON.parse(rawBody) : {};
}

function normalizeAppointment(rawData) {
  return {
    firstName: cleanString(rawData.firstName, 80),
    lastName: cleanString(rawData.lastName, 80),
    phone: cleanString(rawData.phone, 40),
    email: cleanString(rawData.email, 120),
    date: cleanString(rawData.date, 40),
    time: cleanString(rawData.time, 40),
    service: cleanString(rawData.service, 80),
    message: cleanString(rawData.message, 1500),
  };
}

function cleanString(value, maxLength) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function validateAppointment(data) {
  if (!data.firstName) {
    return 'First name is required.';
  }

  if (!data.phone) {
    return 'Phone number is required.';
  }

  if (!data.service) {
    return 'Service is required.';
  }

  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return 'Please provide a valid email address.';
  }

  return null;
}

async function addToNotion(data) {
  const payload = {
    parent: { database_id: process.env.NOTION_DATABASE_ID },
    properties: {
      Name: {
        title: [{ text: { content: getFullName(data) } }],
      },
      Phone: {
        phone_number: data.phone,
      },
      Email: {
        email: data.email || null,
      },
      Service: {
        select: { name: getServiceLabel(data.service) },
      },
      'Preferred Date': {
        date: data.date ? { start: data.date } : null,
      },
      'Preferred Time': {
        select: { name: getTimeLabel(data.time) },
      },
      Message: {
        rich_text: [{ text: { content: data.message || '' } }],
      },
      Status: {
        select: { name: 'New' },
      },
      'Submitted At': {
        date: { start: new Date().toISOString() },
      },
    },
  };

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': NOTION_VERSION,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Notion API returned ${response.status}`);
  }
}

async function sendToTelegram(data) {
  const text = [
    '<b>New Appointment Request - Mani Dental Clinic</b>',
    '',
    `<b>Name:</b> ${escapeHtml(getFullName(data))}`,
    `<b>Phone:</b> ${escapeHtml(data.phone)}`,
    `<b>Email:</b> ${escapeHtml(data.email || 'Not provided')}`,
    `<b>Date:</b> ${escapeHtml(data.date || 'Not specified')}`,
    `<b>Time:</b> ${escapeHtml(getTimeLabel(data.time))}`,
    `<b>Service:</b> ${escapeHtml(getServiceLabel(data.service))}`,
    `<b>Concern:</b> ${escapeHtml(data.message || 'None')}`,
    '',
    `<i>Submitted at ${escapeHtml(getIndiaTimestamp())}</i>`,
  ].join('\n');

  const response = await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Telegram API returned ${response.status}`);
  }
}

function getFullName(data) {
  return [data.firstName, data.lastName].filter(Boolean).join(' ');
}

function getServiceLabel(service) {
  return serviceLabels[service] || service || 'Not specified';
}

function getTimeLabel(time) {
  return timeLabels[time] || time || 'Not specified';
}

function getIndiaTimestamp() {
  return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
