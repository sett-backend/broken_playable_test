const fs = require('fs');
const distFolder = __dirname + '/../../dist/';
fs.readdirSync(distFolder).map((fileName) => {
    if (fileName.includes('MOLOCO')) {
        fs.readFile(distFolder + fileName, 'utf8', (err, data) => {
            data = data.replace('new XMLHttpRequest', 'new Date');
            fs.writeFile(distFolder + fileName, data, async (err) => {
                if (err) throw err;
            });
        });
    }
});
