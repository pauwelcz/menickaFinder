import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@ObjectType()
export class MenickoDTO {
  @IsOptional()
  @Field()
  public restaurant: string;

  @IsOptional()
  @Field()
  public name: string;

  @IsOptional()
  @Field(() => Int, { nullable: true, defaultValue: null })
  public price: number;
}
