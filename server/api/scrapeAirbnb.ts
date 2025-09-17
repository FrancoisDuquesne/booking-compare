import { defineEventHandler, getQuery } from "h3";
import axios from "axios";
import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event);

  if (!url || typeof url !== "string") {
    return { error: "Missing URL" };
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const $ = cheerio.load(html);

    // Try to extract data from JSON-LD first
    let data: any = null;
    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const jsonText = $(element).html();
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          if (
            parsed["@type"]?.toLowerCase().includes("hotel") ||
            parsed["@type"]?.toLowerCase().includes("accommodation") ||
            parsed["@type"]?.toLowerCase().includes("place") ||
            parsed.name
          ) {
            data = parsed;
            return false; // break the loop
          }
        }
      } catch (e) {
        // Continue to next script tag
      }
    });

    let name = "";
    let price = "";
    let rating = "";
    let location = "";
    let image = "";

    if (data) {
      // Extract from JSON-LD
      name = data.name || "";

      if (data.offers?.price) {
        price = `${data.offers.price} ${data.offers.priceCurrency || ""}`;
      } else if (data.offers?.[0]?.price) {
        price = `${data.offers[0].price} ${data.offers[0].priceCurrency || ""}`;
      }

      if (data.aggregateRating?.ratingValue) {
        rating = `${data.aggregateRating.ratingValue}/5`;
      }

      if (data.address) {
        const addressParts = [
          data.address.streetAddress,
          data.address.addressLocality,
          data.address.addressRegion,
          data.address.addressCountry,
        ].filter(Boolean);
        location = addressParts.join(", ");
      }

      if (Array.isArray(data.image)) {
        image = data.image[0];
      } else if (data.image) {
        image = data.image;
      }
    }

    // Fallback to HTML parsing if JSON-LD didn't work
    if (!name) {
      name =
        $("h1").first().text().trim() ||
        $('[data-testid="listing-title"]').text().trim() ||
        $("._fecoyn4").text().trim() ||
        $("title").text().replace(" - Airbnb", "").trim();
    }

    if (!price) {
      price =
        $('[data-testid="price-availability-row"]').text().trim() ||
        $("._tyxjp1").text().trim() ||
        $("._1y74zjx").text().trim() ||
        $("span")
          .filter((_, el) => $(el).text().includes("$"))
          .first()
          .text()
          .trim();
    }

    if (!rating) {
      const ratingText =
        $('[data-testid="listing-rating"]').text().trim() ||
        $("._17p6nbba").text().trim() ||
        $("span")
          .filter((_, el) => $(el).text().includes("★"))
          .first()
          .text()
          .trim();
      if (ratingText) {
        rating = ratingText;
      }
    }

    if (!location) {
      location =
        $('[data-testid="listing-location"]').text().trim() ||
        $("._9xiloll").text().trim() ||
        $('[data-plugin-in-point-id="NEIGHBORHOOD_DEFAULT"]').text().trim();
    }

    if (!image) {
      const imgSrc =
        $("img").first().attr("src") ||
        $('[data-testid="photo-viewer"] img').first().attr("src") ||
        $("._6tbg2q img").first().attr("src");
      if (imgSrc) {
        image = imgSrc.startsWith("http") ? imgSrc : `https:${imgSrc}`;
      }
    }

    return { url, name, price, rating, location, image };
  } catch (err: any) {
    console.error("Airbnb scraping error:", err);
    return {
      error: "Scraping failed",
      details: err.message?.substring(0, 200) || "Unknown error",
    };
  }
});
