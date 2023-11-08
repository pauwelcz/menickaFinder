import { Module } from '@nestjs/common';
import { MenickaResolver } from './menicka.resolver';
import { MenickaService } from './menicka.service';
import { MenickaController } from './menicka.controller';

@Module({
  controllers: [MenickaController],
  providers: [MenickaResolver, MenickaService],
  exports: [MenickaResolver],
})
export class MenickaModule {}
