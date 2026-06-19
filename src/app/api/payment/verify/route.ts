import { NextRequest, NextResponse } from "next/server";
import { confirmBookingPayment } from "@/lib/mongodb";
import { sendBookingEmail, sendClientConfirmationEmail } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing order_id parameter" },
        { status: 400 }
      );
    }

    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || "sandbox";

    let booking: any = null;
    let paymentSuccess = false;
    let transactionId = `tx_${Date.now()}`;

    // If API keys are missing, run in developer mock mode
    if (!appId || !secretKey) {
      console.warn("Cashfree keys missing. Instantly verifying mock order.");
      booking = await confirmBookingPayment(orderId, `mock_tx_${Date.now()}`);
      paymentSuccess = true;
    } else {
      // Prepare Cashfree API call
      const cashfreeUrl =
        env === "production"
          ? `https://api.cashfree.com/pg/orders/${orderId}`
          : `https://sandbox.cashfree.com/pg/orders/${orderId}`;

      const response = await fetch(cashfreeUrl, {
        method: "GET",
        headers: {
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "x-api-version": "2023-08-01",
          "Accept": "application/json",
        },
      });

      const orderDetails = await response.json();

      if (response.ok && orderDetails.order_status === "PAID") {
        paymentSuccess = true;
        // Fetch transaction id if available
        transactionId = orderDetails.cf_order_id || orderDetails.order_id || transactionId;
        booking = await confirmBookingPayment(orderId, transactionId);
      } else {
        console.error("Cashfree Payment Verification failed or unpaid:", orderDetails);
      }
    }

    // Redirect URLs based on outcome
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    if (paymentSuccess && booking) {
      // Trigger confirmation emails in background
      try {
        await sendBookingEmail(booking);
        await sendClientConfirmationEmail(booking);
      } catch (err) {
        console.error("Failed to send booking emails on payment confirmation:", err);
      }

      return NextResponse.redirect(`${protocol}://${host}/booking-success?order_id=${orderId}`);
    } else {
      return NextResponse.redirect(`${protocol}://${host}/booking-success?order_id=${orderId}&status=failed`);
    }
  } catch (error: any) {
    console.error("Payment Verification error:", error);
    // Redirect to home page with error query in case of fatal error
    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(`${protocol}://${host}?payment_error=true`);
  }
}
