export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { firstName, lastName, phone, email, date, time, service, message } = req.body;

  if (!firstName || !phone || !service) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const results = { notion: false, telegram: false, notionError: null };

  try {
    await addToNotion({ firstName, lastName, phone, email, date, time, service, message });
    results.notion = true;
  } catch (err) {
    console.error('Notion error:', err.message);
    results.notionError = err.message; // expose error in response for debugging
  }

  try {
    await sendToTelegram({ firstName, lastName, phone, email, date, time, service, message });
    results.telegram = true;
  } catch (err) {
    console.error('Telegram error:', err.message);
  }

  res.status(200).json({ success: true, results });
}

// ─── NOTION ───────────────────────────────────────────────────────────────────
async function addToNotion(data) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const NOTION_DB_ID = process.env.NOTION_DATABASE_ID;

  // Log env var presence (not values) to help debug
  console.log('NOTION_TOKEN present:', !!NOTION_TOKEN);
  console.log('NOTION_DB_ID present:', !!NOTION_DB_ID);
  console.log('NOTION_DB_ID value:', NOTION_DB_ID);

  const serviceLabels = {
    preventive:  'Preventive Dentistry',
    childrens:   "Children's Dentistry",
    cosmetic:    'Cosmetic Dentistry',
    implants:    'Dental Implants',
    rootcanal:   'Root Canal Therapy',
    periodontal: 'Periodontal Therapy',
    veneers:     'Porcelain Veneers',
    whitening:   'Teeth Whitening',
    dentures:    'Dentures & Bridges',
    general:     'General Consultation',
  };

  const timeLabels = {
    '9am':  '9:00 AM - 10:00 AM',
    '10am': '10:00 AM - 11:00 AM',
    '11am': '11:00 AM - 12:00 PM',
    '12pm': '12:00 PM - 1:00 PM',
    '1pm':  '1:00 PM - 2:00 PM',
    '2pm':  '2:00 PM - 3:00 PM',
    '3pm':  '3:00 PM - 4:00 PM',
    '4pm':  '4:00 PM - 5:00 PM',
    '5pm':  '5:00 PM - 6:00 PM',
  };

  const payload = {
    parent: { database_id: NOTION_DB_ID },
    properties: {
      'Name': {
        title: [{ text: { content: `${data.firstName} ${data.lastName}` } }]
      },
      'Phone': {
        phone_number: data.phone
      },
      'Email': {
        email: data.email || null
      },
      'Service': {
        select: { name: serviceLabels[data.service] || data.service }
      },
      'Preferred Date': {
        date: data.date ? { start: data.date } : null
      },
      'Preferred Time': {
        select: { name: timeLabels[data.time] || data.time || 'Not specified' }
      },
      'Message': {
        rich_text: [{ text: { content: data.message || '' } }]
      },
      'Status': {
        select: { name: '🆕 New' }
      },
      'Submitted At': {
        date: { start: new Date().toISOString() }
      },
    },
  };

  console.log('Sending to Notion DB:', NOTION_DB_ID);

  const response = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify(payload),
  });

  const responseText = await response.text();
  console.log('Notion response status:', response.status);
  console.log('Notion response body:', responseText);

  if (!response.ok) {
    throw new Error(`Notion API error ${response.status}: ${responseText}`);
  }
}

// ─── TELEGRAM ─────────────────────────────────────────────────────────────────
async function sendToTelegram(data) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  const serviceLabels = {
    preventive:  'Preventive Dentistry',
    childrens:   "Children's Dentistry",
    cosmetic:    'Cosmetic Dentistry',
    implants:    'Dental Implants',
    rootcanal:   'Root Canal Therapy',
    periodontal: 'Periodontal Therapy',
    veneers:     'Porcelain Veneers',
    whitening:   'Teeth Whitening',
    dentures:    'Dentures & Bridges',
    general:     'General Consultation',
  };

  const timeLabels = {
    '9am':  '9:00 AM - 10:00 AM',
    '10am': '10:00 AM - 11:00 AM',
    '11am': '11:00 AM - 12:00 PM',
    '12pm': '12:00 PM - 1:00 PM',
    '1pm':  '1:00 PM - 2:00 PM',
    '2pm':  '2:00 PM - 3:00 PM',
    '3pm':  '3:00 PM - 4:00 PM',
    '4pm':  '4:00 PM - 5:00 PM',
    '5pm':  '5:00 PM - 6:00 PM',
  };

  const text =
    `🦷 *New Appointment Request — Mani Dental Clinic*\n\n` +
    `👤 *Name:* ${data.firstName} ${data.lastName}\n` +
    `📞 *Phone:* ${data.phone}\n` +
    `📧 *Email:* ${data.email || 'Not provided'}\n` +
    `📅 *Date:* ${data.date || 'Not specified'}\n` +
    `⏰ *Time:* ${timeLabels[data.time] || data.time || 'Not specified'}\n` +
    `🏥 *Service:* ${serviceLabels[data.service] || data.service}\n` +
    `💬 *Concern:* ${data.message || 'None'}\n\n` +
    `_Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}_`;

  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'Markdown' }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Telegram API error: ${err}`);
  }
}