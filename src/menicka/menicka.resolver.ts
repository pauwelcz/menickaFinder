import { Query, Resolver } from '@nestjs/graphql';
import { MenickoDTO } from './dto/menicka.dto';
import { MenickaService } from './menicka.service';

@Resolver(() => MenickoDTO)
export class MenickaResolver {
  public constructor(private menickaService: MenickaService) {}

  @Query(() => [MenickoDTO], { nullable: true, defaultValue: [] })
  async find(): Promise<MenickoDTO[]> {
    return this.menickaService.find();
  }
}
