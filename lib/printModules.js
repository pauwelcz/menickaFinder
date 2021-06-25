'use-strict';
/*
    FILE MODULES
*/
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { error } = require('console');

/**
 * Funkce pro vypis celého menu
 * @param {*} array pole objektů s meny jednotlivých restaurací 
 * @param {*} date datum
 * @param {*} output cesta pro uložení menu, v případě, že není, výpis do konzole 
 * @param {*} fileName jméno ukládaného souboru (v kombinaci s parametrem "output"), v případě absence je jméno ve tvaru "DD-MM-YYYY.txt"
 * @param {*} homeDir domovský adresář
 */
 async function printMenu(array, date, output, fileName, homeDir) {
    let text = "NABÍDKA JÍDEL Z VYBRANÝCH RESTAURACÍ\n\n";
    let noMenuCounter = array.length;
    for (const object of array) {
        if (object.error) {
            noMenuCounter--;
            console.error(`Vyskytla se chyba pro nalezení menu restaurace: \"${object.name}\".`)
            console.error(`Kód chyby:\t${object.error}`);
            continue;
        }
        text += `V restauraci \"${object.name}\" je tato nabidka:\n`;
        text += (object.menu.length !== 0) ? `${object.menu}\n` : `Žádná nabídka.\n`;
        text += `▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰\n`;
    } 

    // Pravděpodobnost chyby u všech restaurací
    if (noMenuCounter === 0) {
        console.error("Bohužel Vám nemůžeme ukázat žádnou nabídku.");
        process.exit()
    }

    /**
     * Výstup do souboru či konzole
     */
    if (output.length == 0) {
        console.log(text);
    } else {
        try {
            await mkdirp(path.join(homeDir, output))
                .then(() => console.log('Directory(ies) is/are done!'))
                .catch(e => console.error(e));

            const fileNameFull = (fileName.length == 0) ? `${date.day}-${date.month}-${date.year}.txt` : `${fileName}.txt`;
            const fullPath = path.join(homeDir, output, fileNameFull)
            fs.writeFileSync(fullPath, text)
        } catch (e) {
            console.error(e);
            process.exit();
        }
    }     
}

/**
 * Funkce pro přidání položek do menu
 * @param {*} object parametr obsahující informace o jídle
 * @returns čitelnou podobu s informacemi o jídlech
 */
function addItemToMenu(object) {
    let text = `Kategorie:\t${object.category}\n`;
    text += `Název:\t\t${object.title}\n`;
    text += `Popis:\t\t${object.description}\n`;
    text += `Cena:\t\t${object.price}\n`;
    text += `------------------------------\n`;
    return text;
}

exports.printMenu = printMenu;
exports.addItemToMenu = addItemToMenu;
