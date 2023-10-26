import { MenickoDTO } from './dto/menicka.dto';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { MenickaInput } from './types/menicka.input';

@Injectable()
export class MenickaService {
  public async findTodayMenus(input: MenickaInput): Promise<MenickoDTO[]> {
    const dateToday = this.getTodayDate();

    const allData = await this.getDataFromAllRestaurants(input.ids);

    const menuObjects: MenickoDTO[] = [];
    allData.forEach(async ({ data }) => {
      const body = parse(data.toString('latin1'));
      const menicka = body.querySelectorAll('div.menicka');

      for (const item of menicka) {
        if (item.outerHTML.indexOf(dateToday) !== -1) {
          const restaurant = body.querySelector('.line1 > h1').innerText.trim();
          const list = item.querySelectorAll('li');

          list.forEach((item) => {
            const jidlo = item.querySelector('.polozka');
            const price = item.querySelector('.cena');
            menuObjects.push({
              restaurant,
              name: jidlo.text.trim(),
              price: price ? parseInt(price.text) : 0,
            });
          });
          return menuObjects;
        }
      }
    });

    return menuObjects;
  }

  private getDataFromAllRestaurants(ids: number[]) {
    const promises = ids.map((id) => {
      return axios.request({
        method: 'GET',
        url: `https://www.menicka.cz/${id}.html`,
        responseType: 'arraybuffer',
        responseEncoding: 'binary',
      });
    });
    return Promise.all(promises);
  }

  private getTodayDate() {
    const dateToday = new Date();
    return `${dateToday.getDate()}.${
      dateToday.getMonth() + 1
    }.${dateToday.getFullYear()}`;
  }
}
