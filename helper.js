module.exports = {
    inject_jquery: async (page) => {
        // console.log('HELPER: injecting jquery');
        await page.evaluate(() => {
            var jq = document.createElement("script")
            jq.setAttribute('type', 'text/javascript');
            jq.src = "https://code.jquery.com/jquery-3.2.1.min.js"
            return new Promise((resolve) => {
                jq.addEventListener("load", () => {
                    resolve();
                });
                document.getElementsByTagName("head")[0].appendChild(jq);
            });
        })
        const watchDog = page.waitForFunction('window.jQuery !== undefined');
        await watchDog;
    },
    jqueryExists: async (page) => {
        page.evaluate(() => {
            if (typeof jQuery == 'undefined') {
                return false;
            }
            return true;
        });
    },
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
};