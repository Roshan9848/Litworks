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
    const packageId = searchParams.get("packageId");

    if (packageId) {
      const ObjectId = require("mongodb").ObjectId;
      try {
        const pkg = await db.collection("packages").findOne({ _id: new ObjectId(packageId) });
        if (!pkg) {
          return NextResponse.json({ success: false, error: "Custom package not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, package: pkg });
      } catch (err) {
        return NextResponse.json({ success: false, error: "Invalid package ID format" }, { status: 400 });
      }
    }

    // Fetch CMS settings
    const cmsList = await db.collection("websitecontents").find().toArray();
    const cmsMap: { [key: string]: any } = {};
    cmsList.forEach((item) => {
      cmsMap[item.sectionKey] = item.content;
    });

    // Fetch active packages
    const packages = await db
      .collection("packages")
      .find({ status: "active" })
      .sort({ category: 1, price: 1 })
      .toArray();

    // Map packages into categories
    const basicPackages = packages.filter((p) => p.category === "basic");
    const weddingPackages = packages.filter((p) => p.category === "wedding");

    return NextResponse.json({
      success: true,
      cms: cmsMap,
      packages: {
        basic: basicPackages,
        wedding: weddingPackages
      }
    });
  } catch (error: any) {
    console.error("Website content API error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
