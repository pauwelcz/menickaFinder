import { Module } from '@nestjs/common';
import { MenickaResolver } from './menicka.resolver';
import { MenickaService } from './menicka.service';

@Module({
  providers: [MenickaResolver, MenickaService],
  exports: [MenickaResolver],
})
export class MenickaModule {}
