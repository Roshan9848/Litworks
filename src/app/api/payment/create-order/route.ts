import { NextRequest, NextResponse } from "next/server";
import { savePendingBooking } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, state, city, service, notes, dynamicFields } = body;

    // Validate inputs
    if (!name || !phone || !email || !service) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate unique Order ID
    const orderId = `LIT-${Date.now()}`;

    // Save pending booking in the database
    const pendingBooking = {
      name,
      phone,
      email,
      state,
      city,
      service,
      notes,
      dynamicFields,
    };
    await savePendingBooking(pendingBooking, orderId);

    // Get Cashfree credentials
    const appId = process.env.CASHFREE_APP_ID;
    const secretKey = process.env.CASHFREE_SECRET_KEY;
    const env = process.env.CASHFREE_ENV || "sandbox";

    // If API keys are missing, run in developer mock mode
    if (!appId || !secretKey) {
      console.warn("Cashfree App ID or Secret Key missing. Running in mock developer mode.");
      return NextResponse.json({
        success: true,
        mock: true,
        payment_session_id: `mock_session_${Math.random().toString(36).substring(7)}`,
        order_id: orderId,
      });
    }

    // Prepare Cashfree API call
    const cashfreeUrl =
      env === "production"
        ? "https://api.cashfree.com/pg/orders"
        : "https://sandbox.cashfree.com/pg/orders";

    // Obtain base URL of origin for return redirects
    const host = req.headers.get("host") || "localhost:3000";
    // Cashfree production environment strictly requires HTTPS for return_url
    const protocol = env === "production" ? "https" : (host.includes("localhost") ? "http" : "https");
    const returnUrl = `${protocol}://${host}/api/payment/verify?order_id={order_id}`;

    const payload = {
      order_amount: 10.00, // Temporarily set to 10 INR for live test verification
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: phone.replace(/[^0-9]/g, "") || `cust_${Date.now()}`,
        customer_phone: phone.replace(/[^0-9]/g, "").slice(-10) || "9999999999",
        customer_name: name,
        customer_email: email,
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    const response = await fetch(cashfreeUrl, {
      method: "POST",
      headers: {
        "x-client-id": appId,
        "x-client-secret": secretKey,
        "x-api-version": "2023-08-01",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("Cashfree API Order Creation failed:", resData);
      return NextResponse.json(
        { success: false, error: resData.message || "Failed to create order on Cashfree" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mock: false,
      payment_session_id: resData.payment_session_id,
      order_id: orderId,
      environment: env,
    });
  } catch (error: any) {
    console.error("Payment Order Creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
