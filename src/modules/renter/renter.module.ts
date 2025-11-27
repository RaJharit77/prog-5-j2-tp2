import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RenterService } from './services/renter.service';
import { RenterController } from './controllers/renter.controller';
import { RenterRepository } from './repositories/renter.repository';
import { Renter } from './entities/renter.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Renter])],
    controllers: [RenterController],
    providers: [RenterService, RenterRepository],
    exports: [RenterService],
})
export class RenterModule { }