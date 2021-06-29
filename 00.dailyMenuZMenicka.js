'use strict';
const parser = require('./lib/parsersWithPredefinedModules.js');
const printer = require('./lib/printModules.js');
/*
	COMMANDER
*/
const program = require('commander')
    program
        .option('-r, --restaurants <string>', 'Path to of objects with restaurants', './data/restaurants.json')
        .option('-o, --output <string>', 'Parameter for saving file, if parameter is not set, output is printed to console.', '')
        .option('-n, --name <string>', 'Parameter for name of file (in combination with parameter output), if parameter is not set, name of file is in format "DD-MM-YYYY.txt".', '')
        .parse(process.argv);

try {
    const restaurants = require(`${program.restaurants}`);
} catch (e) {
    console.error(e);
    process.exit()
}

/**
    FILE PREPARINGS
 */
const fileDirectory = program.output;
const fileName = program.name;
const homeDir = __dirname;

(async function main () {
    const restaurants = require(`${program.restaurants}`);
    /**
     * Ziskani spravneho datumu
     */
    const dateToday = new Date();
    const dateTodayParsed = {
        day: dateToday.getDate(),
        month: dateToday.getMonth() + 1,
        year: dateToday.getFullYear(),
    }

    /**
     * Projeti restauraci v souboru
     */
    const menuObjects = [];
    for (const object of restaurants) {
        menuObjects.push(parser.menickaParser(object, dateTodayParsed));
    }

    /**
     * Vytisknutí buď do souboru nebo na obrazovku
     */
     await printer.printMenu(await Promise.all(menuObjects), dateTodayParsed, fileDirectory, fileName, homeDir);

     process.exit();
})();