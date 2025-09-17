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
            parsed["@type"] &&
            (parsed["@type"].includes("Hotel") ||
              parsed["@type"].includes("LodgingBusiness") ||
              parsed["@type"].includes("Accommodation") ||
              parsed.name ||
              parsed.offers)
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
        price = `€${data.offers.price}/night`;
      } else if (data.offers?.[0]?.price) {
        price = `€${data.offers[0].price}/night`;
      }

      if (data.aggregateRating?.ratingValue) {
        rating = `${data.aggregateRating.ratingValue}/10`;
      }

      if (data.address) {
        const addressParts = [
          data.address.streetAddress,
          data.address.postalCode,
          data.address.addressLocality,
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
        $("#hp_hotel_name").text().trim() ||
        $("h1").first().text().trim() ||
        $(".pp-header__title").text().trim() ||
        $('[data-testid="title"]').text().trim();
    }

    if (!price) {
      const priceText =
        $(".priceblock-dealsprice").text().trim() ||
        $(".priceblock-ourprice").text().trim() ||
        $(".bui-price-display__value").text().trim() ||
        $('[data-testid="price-and-discounted-price"]').text().trim() ||
        $(".sr_price_wrap").text().trim();
      if (priceText) {
        price = priceText.replace(/\s+/g, " ").trim();
      }
    }

    if (!rating) {
      const ratingText =
        $(".bui-review-score__badge").text().trim() ||
        $(".review-score-badge").text().trim() ||
        $('[data-testid="review-score-badge"]').text().trim() ||
        $(".bk-barrating__text").text().trim();
      if (ratingText) {
        rating = ratingText;
      }
    }

    if (!location) {
      location =
        $(".hp_address_subtitle").text().trim() ||
        $('[data-node_tt_id="location_score_tooltip"]').text().trim() ||
        $(".address").text().trim() ||
        $('[data-testid="address"]').text().trim();
    }

    if (!image) {
      const imgSrc =
        $(".hotelimg img").first().attr("src") ||
        $(".bh-photo-grid img").first().attr("src") ||
        $('[data-testid="property-gallery"] img').first().attr("src") ||
        $("#hotel_main_content img").first().attr("src");
      if (imgSrc) {
        image = imgSrc.startsWith("http") ? imgSrc : `https:${imgSrc}`;
      }
    }

    return { url, name, price, rating, location, image };
  } catch (err: any) {
    console.error("Booking scraping error:", err);
    return {
      error: "Scraping failed",
      details: err.message?.substring(0, 200) || "Unknown error",
    };
  }
});
