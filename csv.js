const fs = require('fs');
const csv = require('fast-csv');



function writeToCsv(username, data) {


    let filename = `./data/${username}.csv`;
    const csvStream = csv.format({ headers: true }),
        writableStream = fs.createWriteStream(filename);

    writableStream.on("finish", function () {
        console.log(`DONE!, Please cheack ${filename}`);
    });

    csvStream.pipe(writableStream);

    for (d in data) {
        csvStream.write(data[d]);
    }

    csvStream.end();
}

module.exports = writeToCsv;