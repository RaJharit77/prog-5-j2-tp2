import { Injectable, ConflictException } from '@nestjs/common';
import { RenterRepository } from '../repositories/renter.repository';
import { CreateRenterDto } from '../dto/create-renter.dto';
import { UpdateRenterDto } from '../dto/update-renter.dto';
import { Renter } from '../entities/renter.entity';
import { BaseService } from '../../../common/abstractions/base.service';
import { EntityNotFoundException } from '../../../common/exceptions/entity-not-found.exception';

@Injectable()
export class RenterService extends BaseService<Renter> {
    constructor(private readonly renterRepository: RenterRepository) {
        super(RenterService.name);
    }

    async findAll(): Promise<Renter[]> {
        this.logger.log('Fetching all renters');
        return this.renterRepository.findAll();
    }

    async findById(id: number): Promise<Renter> {
        this.logger.log(`Fetching renter with ID: ${id}`);
        const renter = await this.renterRepository.findById(id);

        if (!renter) {
            throw new EntityNotFoundException('Renter', id);
        }

        return renter;
    }

    async create(createRenterDto: CreateRenterDto): Promise<Renter> {
        this.logger.log('Creating new renter');

        const existingRenter = await this.renterRepository.findByEmail(createRenterDto.email);
        if (existingRenter) {
            throw new ConflictException('Renter with this email already exists');
        }

        try {
            const renter = await this.renterRepository.create(createRenterDto);
            this.logger.log(`Renter created with ID: ${renter.id}`);
            return renter;
        } catch (error) {
            this.logger.error('Failed to create renter', error instanceof Error ? error.stack : 'Unknown error');
            throw error;
        }
    }

    async update(id: number, updateRenterDto: UpdateRenterDto): Promise<Renter> {
        this.logger.log(`Updating renter with ID: ${id}`);

        const existingRenter = await this.renterRepository.findById(id);
        if (!existingRenter) {
            throw new EntityNotFoundException('Renter', id);
        }

        if (updateRenterDto.email && updateRenterDto.email !== existingRenter.email) {
            const emailExists = await this.renterRepository.findByEmail(updateRenterDto.email);
            if (emailExists) {
                throw new ConflictException('Renter with this email already exists');
            }
        }

        const result = await this.renterRepository.update(id, updateRenterDto);
        if (!result) {
            throw new EntityNotFoundException('Renter', id);
        }
        return result;
    }

    async delete(id: number): Promise<boolean> {
        this.logger.log(`Deleting renter with ID: ${id}`);

        const existingRenter = await this.renterRepository.findById(id);
        if (!existingRenter) {
            throw new EntityNotFoundException('Renter', id);
        }

        return this.renterRepository.delete(id);
    }

    async findByType(type: string): Promise<Renter[]> {
        this.logger.log(`Fetching renters of type: ${type}`);
        return this.renterRepository.findByType(type);
    }
}