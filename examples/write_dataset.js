const Apify = require('apify');

Apify.main(async () => {
    // Write a single row to the default dataset
    // await Apify.pushData({ col1: 123, col2: 'val2' });

    // Open a named dataset
    const dataset = await Apify.openDataset('index-page');

    // Write a single row
    await dataset.pushData({ foo: 'bar' });

    // Write multiple rows
    await dataset.pushData([{ foo: 'bar2', col2: 'val2' }, { col3: 123 }]);
});