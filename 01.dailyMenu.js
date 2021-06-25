'use strict';
const parser = require('./lib/parsersWithPredefinedModules.js');
const printModules = require('./lib/printModules.js');
/*
	COMMANDER
*/
const program = require('commander')
    program
        .option('-r, --restaurants <string>', 'File of objects with restaurants', './data/restaurants.json')
        .option('-o, --output <string>', 'Parameter for saving file, if parameter is not set, output is printed to console.', '')
        .option('-n, --name <string>', 'Parameter for name of file (in combination with parameter output), if parameter is not set, name of file is in format "DD-MM-YYYY.txt".', '')
        .parse(process.argv);

/**
    FILE PREPARINGS
 */
const fileDirectory = program.output;
const fileName = program.name;
const homeDir = __dirname;

(async function main() {
    const restaurants = require(`${program.restaurants}`);
    /**
     * Ziskani spravneho datumu + dne v týdnu (v případě některých webů se snáze parsuje)
     */
    const dateToday = new Date();
    const dateTodayParsed = {
        day: dateToday.getDate(),
        month: dateToday.getMonth() + 1,
        year: dateToday.getFullYear()
    }

    const menuObjects = [];
    /**
     * Restaurace VERONA
     */
    menuObjects.push(await parser.menickaParser(restaurants[2], dateTodayParsed));
    /**
     * Restaurace Suzie
     */
    menuObjects.push(await parser.suziesCheerioParser(restaurants[1], dateTodayParsed));

    /**
     * Restaurace u Čápa
     */
    menuObjects.push(await parser.uCapaCheriioParser(restaurants[0], dateTodayParsed));

    /**
     * Vytisknutí buď do souboru nebo na obrazovku
     */
    await printModules.printMenu(menuObjects, dateTodayParsed, fileDirectory, fileName, homeDir);
    process.exit();
})();