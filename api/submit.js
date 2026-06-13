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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const namePattern = /^[\p{L}][\p{L} .'-]*$/u;
const maxMessageLength = 600;

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
  const rawPhone = cleanString(rawData.phone, 40);

  return {
    firstName: cleanString(rawData.firstName, 80),
    lastName: cleanString(rawData.lastName, 80),
    phone: formatIndianMobile(rawPhone) || rawPhone,
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

function getIndianMobileDigits(phone) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }

  return digits;
}

function formatIndianMobile(phone) {
  const mobileDigits = getIndianMobileDigits(phone);

  if (!/^[6-9]\d{9}$/.test(mobileDigits)) {
    return '';
  }

  return `+91 ${mobileDigits.slice(0, 5)} ${mobileDigits.slice(5)}`;
}

function isValidDateValue(dateValue) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return false;
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function validateAppointment(data) {
  if (!data.firstName) {
    return 'First name is required.';
  }

  if (data.firstName.length < 2 || !namePattern.test(data.firstName)) {
    return 'Please provide a valid first name.';
  }

  if (!data.lastName) {
    return 'Last name is required.';
  }

  if (data.lastName.length < 2 || !namePattern.test(data.lastName)) {
    return 'Please provide a valid last name.';
  }

  if (!data.phone) {
    return 'Phone number is required.';
  }

  if (!formatIndianMobile(data.phone)) {
    return 'Please provide a valid 10-digit Indian mobile number.';
  }

  if (data.email && !emailPattern.test(data.email)) {
    return 'Please provide a valid email address.';
  }

  const today = new Date().toISOString().split('T')[0];

  if (!data.date) {
    return 'Preferred date is required.';
  }

  if (!isValidDateValue(data.date)) {
    return 'Please provide a valid preferred date.';
  }

  if (data.date < today) {
    return 'Preferred date cannot be in the past.';
  }

  if (!data.time) {
    return 'Preferred time is required.';
  }

  if (!timeLabels[data.time]) {
    return 'Please choose a valid appointment time.';
  }

  if (!data.service) {
    return 'Service is required.';
  }

  if (!serviceLabels[data.service]) {
    return 'Please choose a valid service.';
  }

  if (data.message.length > maxMessageLength) {
    return `Please keep the message under ${maxMessageLength} characters.`;
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
