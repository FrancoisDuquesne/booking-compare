import { defineEventHandler, getQuery } from "h3";
import { chromium } from "playwright";

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);

  if (!url || typeof url !== "string") {
    return { error: "Missing URL" };
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // Collect all JSON-LD scripts
    const jsonLdBlocks = await page.$$eval(
      'script[type="application/ld+json"]',
      (els) => els.map((el) => el.textContent || "").filter(Boolean),
    );

    if (!jsonLdBlocks.length) {
      return { error: "Could not find property JSON-LD" };
    }

    // Airbnb often has multiple JSON-LD, we want the one describing an "Hotel" or "Accommodation"
    let data: any = null;
    for (const block of jsonLdBlocks) {
      try {
        const parsed = JSON.parse(block);
        if (
          parsed["@type"]?.toLowerCase().includes("hotel") ||
          parsed["@type"]?.toLowerCase().includes("accommodation")
        ) {
          data = parsed;
          break;
        }
      } catch {
        continue;
      }
    }

    if (!data) {
      // fallback: just parse the first one
      data = JSON.parse(jsonLdBlocks[0]);
    }

    // Parse fields
    const name = data.name || "";
    const price = data.offers?.price
      ? `${data.offers.price} ${data.offers.priceCurrency || ""}`
      : "";
    const rating = data.aggregateRating?.ratingValue
      ? `Avec une note de ${data.aggregateRating.ratingValue}`
      : "";
    const location =
      data.address?.streetAddress ||
      data.address?.addressLocality ||
      data.address?.addressRegion ||
      "";
    const image = Array.isArray(data.image) ? data.image[0] : data.image || "";

    return { url, name, price, rating, location, image };
  } catch (err: any) {
    return { error: "Scraping failed", details: err.message };
  } finally {
    await browser.close();
  }
});
