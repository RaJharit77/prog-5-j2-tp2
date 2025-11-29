import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';
import { LocationRepository } from './repositories/location.repository';
import { Location } from './entities/location.entity';
import { RenterModule } from '../renter/renter.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), RenterModule],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
  exports: [LocationService],
})
export class LocationModule {}
