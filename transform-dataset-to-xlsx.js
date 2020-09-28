const Apify = require('apify');
const { log } = Apify.utils;
const util = require('util');
const excel = require('excel4node');
const format = require('date-format');

const fileNameOutput = `exported-data/subjects_${format.asString('yyyyMMdd_hhmmss', new Date())}.xlsx`;

Apify.main(async () => {
    const datasetSubjects = await Apify.openDataset('subject-page');

    const writeDataToFile = async (items) => {
        // Create a new instance of a Workbook class
        var workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var worksheet = workbook.addWorksheet('Sheet 1');
        // var worksheet2 = workbook.addWorksheet('Sheet 2');

        // Create a reusable style
        var style = workbook.createStyle({
            font: {
                color: '#000000',
                size: 12
            },
            numberFormat: '$#,##0.00; ($#,##0.00); -'
        });

        // Set value of cell A1 to 100 as a number type styled with paramaters of style
        worksheet.cell(1, 1).string('Nom').style(style);
        worksheet.cell(1, 2).string('Mode Evaluació').style(style);
        worksheet.cell(1, 3).string('URL').style(style);
        // worksheet.cell(1, 3).formula('A1 + B1').style(style);

        // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
        // worksheet.cell(3, 1).bool(true).style(style).style({ font: { size: 14 } });
        items.forEach((item, index) => {
            worksheet.cell(2 + index, 1).string(item.name).style(style);
            worksheet.cell(2 + index, 2).string(item.evMode.join(',')).style(style);
            worksheet.cell(2 + index, 3).string(item.url).style(style);
            // console.log(index);
        });

        // await datasetSubjects.drop();
        // await datasetSubjects.pushData(items);

        // workbook.write("exported-data/subjects.xlsx"); //WOULD NOT WORK
        workbook.writeP = util.promisify(workbook.write);
        await workbook.writeP(fileNameOutput);
    };

    let dd = await datasetSubjects.getData();
    // console.dir(dd.items);
    if (dd.total == 0){
        throw new Error('There are no dataset items to transform to xlsx');
    }
    await writeDataToFile(dd.items);

});