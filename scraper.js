const postcodes = require('./postcodes');
const puppeteer = require('puppeteer');

let scrape = async () => {
    console.log('starting...');
    console.log('postcodes loading -> ', typeof postcodes);
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto('https://www.zoopla.co.uk', {waitUntil: 'networkidle2'});
    await page.waitFor(1000);
    console.log('got to page...');
    // city search selector
    const locationInput = '#search-input-location';
    await page.click(locationInput);

    // before typing in the location, take the user town and convert to postcode.
    // const userSearchLocation = document.querySelector('input.user-search-location').value;// doesnt exist yet!
    const convertTown = 'hull'; // CHANGE THIS TO TEST!

    // helper function to convert search town into postcode.
    const townConvertedToPostcode = postcodeHelper(convertTown, postcodes);
    console.log('got the input town converted', townConvertedToPostcode);
    await page.keyboard.type(townConvertedToPostcode);
    // max capital selector
    const maxPriceInput = '#forsale_price_max';
    await page.select(maxPriceInput, '80000');
    // button to submit
    const submitBtn = 'button#search-submit';
    await page.click(submitBtn);
    await page.waitForSelector('ul.listing-results');

    console.log('******* - Page Loaded - *******');
    const houses = await page.evaluate(() => {
        const array = Array.from(document.querySelectorAll("div.listing-results-wrapper"))
        .map(houseSection => {
            let scrapedProperty = 1;
            return ({
                house: scrapedProperty,
                houseTitle: houseSection.querySelector("h2.listing-results-attr > a").innerText.trim(),
                houseAddress: houseSection.querySelector("span > a.listing-results-address").innerText.trim(),
                housePrice: houseSection.querySelector("a.listing-results-price").innerText.trim(),
                houseLinkUrl: houseSection.querySelector("a.listing-results-price").href
            })
        });
        return array;
    });
    return houses;

    // loop over every house in the list and get the data out.
  };

  scrape()
    .then(value => console.log('value: ',value))


function postcodeHelper(inputTown) {
    let convertedTown = '';
    for (let i =0; i< postcodes.length; i++) {
        console.log('***...Conerting Postcode...***');
        if (postcodes[i].townArea.includes(inputTown)) {
            convertedTown = postcodes[i].Postcode
            console.log('POSTCODE CONVERTED!')
            return convertedTown;
        }
    }

    // return placesArray.filter(place => place.townArea.includes(inputTown))
}