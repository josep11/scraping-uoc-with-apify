const Apify = require('apify');
const uoc_functions = require('./uoc_functions');
const helper = require('./helper.js');
const mainUrl = 'http://cv.uoc.edu/estudiant/mes-uoc/ca/universitat/plans/GR02/index.html';

const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

// process.exit();

//FOR DEBUGGING A MAX OF 10 Rquests
const MAX_REQ_STOP = 100;

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: mainUrl });

    const datasetSubjects = await Apify.openDataset('subject-page');

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ request, page }) => {
            const title = await page.title();
            // console.log(`Title of ${request.url}: ${title}`);

            if (title.toLowerCase().includes('grau de')) {
                await handlePageFunctionIndex({ request, page });
            }

            if (title.toLowerCase().includes('assignatura')) {
                await handlePageFunctionAssignatura({ request, page });
            }

        },
        handleFailedRequestFunction: async ({ request, error, }) => {
            log.exception(`Request ${request.url} failed too many times`);
            log.error(error);
        },
        maxRequestsPerCrawl: MAX_REQ_STOP,
        maxConcurrency: 10,
        launchPuppeteerOptions: {
            // For example, by adding "slowMo" you'll slow down Puppeteer operations to simplify debugging
            slowMo: 50,
        },
    });

    const handlePageFunctionIndex = async ({ request, page }) => {
        const title = await page.title();

        //need to transform href=<a href="javascript:doPla('20201','10.502','CAT');" title="" target="_self">Competències TIC en psicologia</a> to a propper link
        let links = await page.$$eval('a[href*="javascript:doPla"]', (els) => els.map(e => e.href));
        links = links.map(link => uoc_functions.extractParamsFromStr(link)).map(params => uoc_functions.doPla(params[0], params[1], params[2]));
        links.forEach(link => {
            requestQueue.addRequest({ url: link })
        });

        const dataset = await Apify.openDataset('index-page');
        await dataset.pushData({
            title: title,
            url: request.url,
            links: links
        });
    };

    const handlePageFunctionAssignatura = async ({ request, page }) => {
        if (!await helper.jqueryExists(page)) {
            await helper.inject_jquery(page);
        }

        //at this point jquery should be loaded
        let data = await page.evaluate(() => {
            // eslint-disable-next-line no-undef
            let text = $('html').text();

            let subj = {};
            subj.evMode = [];

            if (text.includes('AC: AC') || text.includes('atura: AC')) {
                subj.evMode.push('AC');
            }

            if (text.includes('EX: EX + AC')) {
                subj.evMode.push('EX+AC');
            }

            if (text.includes('AC + PS')) {
                subj.evMode.push('AC+PS');
            }

            if (text.includes('AC + Pr')) {
                subj.evMode.push('AC+Pr');
            }
            // eslint-disable-next-line no-undef
            subj.name = $('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td.subTAULA > font').text();

            // console.log(subj);
            return subj;
        });

        // log.debug(`subject name: ${data.name}`);

        if (!data.name) {
            log.error("No name of the subject was scraped on ", request.url);
        }
        if (!data.evMode) {
            log.error("No evMode on ", request.url);
        }

        log.debug(JSON.stringify(data));

        data.url = request.url;

        await datasetSubjects.pushData(data);
    };

    await crawler.run();
});