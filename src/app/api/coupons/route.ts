import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const dbConnection = await connectToDatabase();
    if (!dbConnection) {
      return NextResponse.json({ success: false, error: "Database connection failed" }, { status: 500 });
    }

    const { db } = dbConnection;
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ success: false, error: "Missing coupon code" }, { status: 400 });
    }

    const coupon = await db.collection("coupons").findOne({
      code: code.toUpperCase(),
      status: "active",
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ],
    });

    if (!coupon) {
      return NextResponse.json({ success: false, error: "Invalid or expired coupon" }, { status: 404 });
    }

    if (coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
      },
    });
  } catch (error: any) {
    console.error("Coupons validation GET error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
