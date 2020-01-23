const puppeteer = require('puppeteer');

const carbon = async (websiteUrl) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.tracing.start();
    await page.goto('https://www.websitecarbon.com/');
    await page.type('#wgd-cc-url', websiteUrl);
    await page.click('#js-new-test-button');
  
    const percentSelector =
      '.media > .media__content > .report-summary__heading > .highlight > .js-countup';
    const co2Selector = '.section #js-emission-count';
    const hostingSelector = '.report-hosting .media__content';
    const statsSelector = '.stat .media__content';
  
    await page.waitForSelector(percentSelector);
  
    const percent = await page.$eval(percentSelector, (el) =>
      el.getAttribute('data-count'),
    );
    await page.waitForSelector(co2Selector);
    const emissionCount = await page.$eval(co2Selector, (el) =>
      el.getAttribute('data-count'),
    );
    const hostingReport = await page.$eval(hostingSelector, (el) =>
      el.innerHTML.replace(/(\r\n|\n|\r)/gm, '').trim(),
    );
    
    const statsList = await page.$$eval(statsSelector, (stats) => {
      return stats.map((stat) => {
        return stat.innerHTML.replace(/(\r\n|\n|\r)/gm, '').trim();
      });
    });
  
    await page.tracing.stop();
    await browser.close();
  
    const obj = {
      CARBON_PERCENT: percent,
      hosting: hostingReport,
      co2: emissionCount,
      stats: statsList,
    };

    console.log(obj);
  
    // res.status(200).send(obj);
    
  } catch (error) {
    console.log(error);
    // res.status(500).send(error.message);
  }
}
carbon('https//marcradziwill.com')
module.exports = {
  carbon: carbon
}