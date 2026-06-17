const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '.env.local');
let config = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const eqIndex = line.indexOf('=');
    if (eqIndex !== -1) {
      const key = line.slice(0, eqIndex).trim();
      const val = line.slice(eqIndex + 1).trim();
      config[key] = val;
    }
  }
}

const host = config.SMTP_HOST;
const port = parseInt(config.SMTP_PORT || '587', 10);
const user = config.SMTP_USER;
const pass = config.SMTP_PASS;

if (!host || !user || !pass) {
  console.error('Error: SMTP variables not fully defined in .env.local');
  process.exit(1);
}

console.log('Testing SMTP connection...');
console.log(`Host: ${host}:${port}`);
console.log(`User: ${user}`);

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

async function sendTestMail() {
  try {
    // Verify transporter configuration
    await transporter.verify();
    console.log('SMTP server connection verified! ✅');

    // Send a test email
    const mailOptions = {
      from: `"LITWORKS Test" <${user}>`,
      to: 'litworks.media@gmail.com',
      subject: 'LITWORKS SMTP Connection Test',
      text: 'Congratulations! Your LITWORKS email server is connected and working successfully.',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #000; color: #fff; padding: 30px; border-radius: 10px; max-width: 500px; margin: auto; border: 1px solid #FF7A00;">
          <h2 style="color: #FF7A00; text-align: center; margin-bottom: 20px;">LITWORKS⚡</h2>
          <p style="font-size: 16px; line-height: 1.5;">Congratulations!</p>
          <p style="font-size: 14px; line-height: 1.5; color: #ccc;">Your LITWORKS SMTP email server is successfully configured and working. Booking notifications will now be routed here automatically.</p>
          <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;">
          <p style="font-size: 11px; color: #666; text-align: center;">This is an automated test from your development workspace.</p>
        </div>
      `,
    };

    console.log('Sending test email to litworks.media@gmail.com...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully! ✅');
    console.log('Message ID:', info.messageId);

  } catch (error) {
    console.error('SMTP testing failed! ❌');
    console.error('Error details:', error);
  }
}

sendTestMail();
