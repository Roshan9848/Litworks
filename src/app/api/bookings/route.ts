import { NextRequest, NextResponse } from 'next/server';
import { saveBooking } from '@/lib/mongodb';
import { sendBookingEmail, sendClientConfirmationEmail } from '@/lib/mailer';

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

    // Send email notifications (await both to ensure Vercel doesn't terminate early)
    try {
      await sendBookingEmail(body);
      await sendClientConfirmationEmail(body);
    } catch (err) {
      console.error('Failed to send email notifications:', err);
    }

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

