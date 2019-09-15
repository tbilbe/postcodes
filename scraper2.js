const puppeteer = require("puppeteer");

(async () => {

  // Extract partners on the page, recursively check the next page in the URL pattern
  const extractPartners = async url => {

    // Scrape the data we want
    const page = await browser.newPage();
    await page.goto(url);
    const housesOnPage = await page.evaluate(() =>
    // queryselect All of the houses h2.listing-results-attr > a
    //   Array.from(document.querySelectorAll("h2.listing-results-attr > a")).map(houseSection => ({
        Array.from(document.querySelectorAll("div.listing-results-wrapper")).map(houseSection => ({
        houseTitle: houseSection.querySelector("h2.listing-results-attr > a").innerText.trim(),
            houseAddress: houseSection.querySelector("span > a.listing-results-address").innerText.trim(),
        housePrice: houseSection.querySelector("div.listing-results-wrapper > div > a.listing-results-price")
      }))
    );
    await page.close();

    // Recursively scrape the next page
    if (partnersOnPage.length < 1) {
      // Terminate if no partners exist
      return partnersOnPage
    } else {
      // Go fetch the next page ?page=X+1
      const nextPageNumber = parseInt(url.match(/page=(\d+)$/)[1], 10) + 1;
      const nextUrl = `https://marketingplatform.google.com/about/partners/find-a-partner?page=${nextPageNumber}`;

      return partnersOnPage.concat(await extractPartners(nextUrl))
    }
  };

  const browser = await puppeteer.launch();
  const firstUrl =
    "https://www.zoopla.co.uk";
  const partners = await extractPartners(firstUrl);

  // Todo: Update database with partners
  console.log(partners);

  await browser.close();
})();