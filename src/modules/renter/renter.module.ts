import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenterService } from './service/renter.service';
import { RenterController } from './controller/renter.controller';
import { RenterRepository } from './repository/renter.repository';
import { Renter } from './entity/renter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Renter])],
  controllers: [RenterController],
  providers: [RenterService, RenterRepository],
  exports: [RenterService],
})
export class RenterModule {}
