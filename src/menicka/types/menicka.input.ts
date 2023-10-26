import { Field, InputType, Int } from '@nestjs/graphql';
import { MinLength } from 'class-validator';

@InputType()
export class MenickaInput {
  @Field(() => [Int], { description: 'Ids of restaurants' })
  @MinLength(1)
  ids: number[];

  @Field(() => Boolean, {
    defaultValue: false,
    nullable: true,
    description: 'Shows menu(s) without soup',
  })
  noSoup: boolean;
}
