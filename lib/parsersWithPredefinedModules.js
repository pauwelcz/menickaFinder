const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const printModules = require('./printModules.js');
const got = require('got');
/*
    Háčky a čárky pro znakovou sadu windows-1250
    Důvod: žádné z kódování nefungovalo jak mělo, takto se to aspoň stane čitelnějším
*/
let windows1250 = require('windows-1250');
const objectCzechChar = require('../data/cp1250Charactes.json');

/**
 * Funkce pro získání těla webu
 * @param {*} url
 * @param {*} encoding
 * @returns
 */
async function getPageBody(url, encoding) {
  try {
    const response = await got(url, encoding);
    return response.body;
  } catch (error) {
    return {
      error: error.code,
    };
  }
}

/**
 * Funkce pracuje pomocí modulu "cheerio", který v kombinaci s tím, že menu všech restaurací jsou na webu "menicka.cz" (tj. stejná struktura webu)
 * umožní naimplementovat velice jednoduchou funkci. Toto je asi nejlínější funkce k napsání, ovšem na druhou stranu nejspíš bude nejobecnější, tudíž
 * bude fungovat na každou restauraci, jejíž chody se zobrazí na webu menicka.cz
 * @param {*} {urlMenicka, name}
 */
async function menickaParser({ urlMenicka, name }, date) {
  if (urlMenicka == undefined)
    return {
      name,
      error: 'BAD_URL_KEY',
    };

  let menu = '';
  const body = await getPageBody(urlMenicka, { encoding: 'binary' });

  if (body.error)
    return {
      name,
      error: body.error,
    };

  /**
        Zakodování diakritiky (háčky) napevno 
    */
  let encodedData = windows1250.encode(body, {
    mode: 'html',
  });

  for (const key in objectCzechChar) {
    encodedData = encodedData.replaceAll(key, objectCzechChar[key]);
  }

  const $ = cheerio.load(encodedData, { decodeEntities: false });
  $('div.menicka').each(function (_index, element) {
    if (
      $(element)
        .find('div.nadpis')
        .text()
        .indexOf(`${date.day}.${date.month}.${date.year}`) !== -1
    ) {
      const menu$ = cheerio.load($(element).html(), { decodeEntities: false });
      menu$('li').each(function (_index, element) {
        /**
         * Restaurace ma zavreno nebo nebylo oznameno menu
         *  <div class='menicka'>
         *   <div class='nadpis'>Sobota 26.6.2021</div>
         *           <ul>
         *               <li class='polevka'>Restaurace má tento den zavřeno.</li>
         *           </ul>
         *   </div>
         *   <div class='menicka'>
         *       <div class='nadpis'>Neděle 27.6.2021</div>
         *       <ul>
         *           <li class='polevka'>Pro tento den nebylo zadáno menu.</li>
         *       </ul>
         *   </div>
         */
        if (!$(element).find('div.polozka').text().length) {
          menu += $(element).text();
          return false;
        }

        /**
         * V menicka.cz je take moznost alergenu
         */
        const alergens = [];
        $(element)
          .find('div.polozka > em')
          .each(function (_index, element) {
            alergens.push(element.attribs.title.trim());
          });

        menu += printModules.addItemToMenu({
          category: element.attribs.class === 'polevka' ? 'Polevka' : 'Jídlo',
          title: $(element).find('div.polozka').text().trim(),
          description: alergens.join(', '),
          price: `${
            $(element).find('div.cena').text().trim().length
              ? $(element).find('div.cena').text().trim()
              : '0 Kč'
          }`.replaceAll(' Kč', ',- Kč'),
        });
      });

      menu = menu.trim();
      return false;
    }
  });

  return {
    menu,
    name,
  };
}

/**
 * Funkce pro nalezení denního menu v suzie
 * @param {} param0
 * @param {*} date
 */
async function suziesCheerioParser({ url, name }, date) {
  if (url == undefined)
    return {
      name,
      error: 'BAD_URL_KEY',
    };
  let menu = '';
  const body = await getPageBody(url, {});
  if (body.error)
    return {
      name,
      error: body.error,
    };

  let $ = cheerio.load(body, { decodeEntities: false });

  $('div#weekly-menu > div.day').each(function (_index, element) {
    if (
      $(element)
        .find('h4')
        .text()
        .trim()
        .indexOf(`${date.day}.${date.month}.`) !== -1
    ) {
      const menu$ = cheerio.load($(element).html(), { decodeEntities: false });
      menu$('div.item').each(function (_index, element) {
        menu += printModules.addItemToMenu({
          category: $(element).find('h6').text().trim(),
          title: $(element).find('div.title').text().trim(),
          description: $(element)
            .find('div.text')
            .text()
            .replace(/\n\s+/g, ' ')
            .trim(),
          price: `${
            $(element).find('div.price').text().length
              ? $(element).find('div.price').text().trim()
              : '0'
          },- Kč`,
        });
      });

      menu += menu$('p').text().trim();
      menu = menu.trim();
      return false;
    }
  });

  return {
    menu,
    name,
  };
}

/**
 * Funkce pro nalezení denního menu u čápa
 * @param {} param0
 * @param {*} date
 */
async function uCapaCheriioParser({ url, name }, date) {
  if (url == undefined)
    return {
      name,
      error: 'BAD_URL_KEY',
    };

  let menu = '';
  const body = await getPageBody(url, {});
  if (body.error)
    return {
      name,
      error: body.error,
    };
  let $ = cheerio.load(body, { decodeEntities: false });

  $(`div.listek > div.row`).each(function (_index, element) {
    // pri nalezeni pozadovaneho datumu muzu vypisovat
    if (
      $(element).find('div.date').text().trim() ==
      `${date.day}\. ${date.month}\. ${date.year}`
    ) {
      // vlozim polevku, vypada to na jednu
      menu += printModules.addItemToMenu({
        category: 'Polévka',
        title: $(element).find('div.polevka').text().trim(),
        description: '',
        price: 'O,- Kč',
      });

      // vlozim zbytek jidel
      const contentForDay = cheerio.load($(element).html(), {
        decodeEntities: false,
      });
      contentForDay('div.row').each(function (_index, element) {
        if ($(element).find('div.food').text().trim().length) {
          menu += printModules.addItemToMenu({
            category: 'Jídlo',
            title: $(element).find('div.food').text().trim(),
            description: '',
            price: $(element)
              .find('div.price')
              .text()
              .trim()
              .replace(' K', ',- K'),
          });
        }
      });

      return false;
    }
  });

  return {
    menu,
    name,
  };
}

exports.menickaParser = menickaParser;
exports.suziesCheerioParser = suziesCheerioParser;
exports.uCapaCheriioParser = uCapaCheriioParser;
