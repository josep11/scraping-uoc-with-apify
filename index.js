const Apify = require('apify');
const uoc_functions = require('./uoc_functions');

const mainUrl = 'http://cv.uoc.edu/estudiant/mes-uoc/ca/universitat/plans/GR02/index.html';


// url to get http://cv.uoc.edu/tren/trenacc/web/GAT_EXP.PLANDOCENTE?any_academico=20201&cod_asignatura=10.511&idioma=CAT&pagina=PD_PREV_SECRE&cache=S

const { log } = Apify.utils;
log.setLevel(log.LEVELS.DEBUG);

let url = uoc_functions.doPla('20201', '10.502', 'CAT');
// process.exit();

Apify.main(async () => {
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: mainUrl });
    // const pseudoUrls = [new Apify.PseudoUrl('https://www.iana.org/[.*]')];

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ request, page }) => {
            const title = await page.title();
            console.log(`Title of ${request.url}: ${title}`);
            //need to transform href=<a href="javascript:doPla('20201','10.502','CAT');" title="" target="_self">Competències TIC en psicologia</a> to a propper link
            let links = await page.$$eval('a[href*="javascript:doPla"]', (els) => els.map(e=> e.href));
            links = links.map( link => uoc_functions.extractParamsFromStr(link)).map(params => uoc_functions.doPla(params[0], params[1], params[2]));
            log.debug(links.join('\n'));
            // await Apify.utils.enqueueLinks({ page, selector: 'a', pseudoUrls, requestQueue });

            //enqueueRequest (manual fn) as opposed as automatically enqueueLinks with pseudoUrls
        },
        maxRequestsPerCrawl: 100,
        maxConcurrency: 10,
    });

    await crawler.run();
});