import { Args, Query, Resolver } from '@nestjs/graphql';
import { MenickoDTO } from './dto/menicka.dto';
import { MenickaService } from './menicka.service';
import { MenickaInput } from './types/menicka.input';

@Resolver(() => MenickoDTO)
export class MenickaResolver {
  public constructor(private menickaService: MenickaService) {}

  @Query(() => [MenickoDTO], { nullable: true, defaultValue: [] })
  async todayMenus(@Args('input') input: MenickaInput): Promise<MenickoDTO[]> {
    return this.menickaService.findTodayMenus(input);
  }
}
