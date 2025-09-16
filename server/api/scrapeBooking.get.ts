import { defineEventHandler, getQuery } from 'h3'
import { chromium } from 'playwright'

export default defineEventHandler(async (event) => {
  const { url } = getQuery(event)

  if (!url || typeof url !== 'string') {
    return { error: 'Missing URL' }
  }

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    // Wait for JSON-LD to appear (should be in the page)
    await page.waitForSelector('script[type="application/ld+json"]', { timeout: 5000 }).catch(() => {})

    // Extract the JSON-LD script content
    const jsonLdText = await page.$eval('script[type="application/ld+json"]', el => el.textContent).catch(() => '')
    if (!jsonLdText) {
      return { error: 'Could not find property JSON-LD' }
    }

    const data = JSON.parse(jsonLdText)

    // Parse fields from JSON-LD
    const name = data.name || ''
    const price = data.offers?.price ? `${data.offers.price} ${data.offers.priceCurrency || ''}` : ''
    const rating = data.aggregateRating?.ratingValue ? `Avec une note de ${data.aggregateRating.ratingValue}` : ''
    const location = data.address?.streetAddress || data.address?.addressLocality || ''
    const image = Array.isArray(data.image) ? data.image[0] : data.image || ''

    return { url, name, price, rating, location, image }

  } catch (err) {
    return { error: 'Scraping failed', details: err.message }
  } finally {
    await browser.close()
  }
})
