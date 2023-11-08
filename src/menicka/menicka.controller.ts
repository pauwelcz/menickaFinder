import { Controller, Get, Body } from '@nestjs/common';
import { MenickaInput } from './dto/menicka.input';
import { MenickoDTO } from './dto/menicka.dto';
import { MenickaService } from './menicka.service';

@Controller('menicka')
export class MenickaController {
  public constructor(private menickaService: MenickaService) {}

  @Get()
  async findAll(@Body() input: MenickaInput): Promise<MenickoDTO[]> {
    return this.menickaService.findTodayMenus(input);
  }
}
