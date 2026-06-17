import { NextRequest, NextResponse } from 'next/server';
import { saveBooking } from '@/lib/mongodb';
import { sendBookingEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic Validation
    const { name, phone, email, state, city, service } = body;
    if (!name || !phone || !email || !state || !city || !service) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save booking (this handles MongoDB and falls back to local file if needed)
    const result = await saveBooking(body);

    // Send email notification (async/non-blocking so API responds immediately)
    sendBookingEmail(body).catch((err) => {
      console.error('Failed to send email notification in background:', err);
    });

    return NextResponse.json({
      success: true,
      message: 'Booking saved successfully and email notification triggered',
      data: result,
    });
  } catch (error: any) {
    console.error('Error handling booking request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    diagnostics: {
      MONGODB_URI_exists: !!process.env.MONGODB_URI,
      MONGODB_URI_length: process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0,
      MONGODB_URI_prefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) : '',
      MONGODB_DB: process.env.MONGODB_DB || 'not_set',
      SMTP_HOST: process.env.SMTP_HOST || 'not_set',
      SMTP_PORT: process.env.SMTP_PORT || 'not_set',
      SMTP_USER: process.env.SMTP_USER || 'not_set',
      SMTP_PASS_exists: !!process.env.SMTP_PASS,
      SMTP_PASS_length: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
    }
  });
}
