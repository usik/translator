import { NextRequest, NextResponse } from "next/server";
import { Polar } from "@polar-sh/sdk";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN ?? "",
  server: (process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production") as "sandbox" | "production",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tryxenith.com";

export async function POST(req: NextRequest) {
  const { productId, locale = "en" } = await req.json();

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  if (!process.env.POLAR_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }

  try {
    const checkout = await polar.checkouts.create({
      products: [productId],
      successUrl: `${siteUrl}/${locale}/pricing/success?checkout_id={CHECKOUT_ID}`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Polar checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
