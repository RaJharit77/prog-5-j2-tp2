import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Renter } from '../entities/renter.entity';
import { IBaseRepository } from '../../../common/interfaces/base-repository.interface';

@Injectable()
export class RenterRepository implements IBaseRepository<Renter> {
    constructor(
        @InjectRepository(Renter)
        private readonly repository: Repository<Renter>,
    ) { }

    async findAll(): Promise<Renter[]> {
        return this.repository.find({ relations: ['locations'] });
    }

    async findById(id: number): Promise<Renter | null> {
        return this.repository.findOne({
            where: { id },
            relations: ['locations'],
        });
    }

    async create(renter: Partial<Renter>): Promise<Renter> {
        const newRenter = this.repository.create(renter);
        return this.repository.save(newRenter);
    }

    async update(id: number, renter: Partial<Renter>): Promise<Renter | null> {
        await this.repository.update(id, renter);
        return this.findById(id);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return typeof result.affected === 'number' && result.affected > 0;
    }

    async findByEmail(email: string): Promise<Renter | null> {
        return this.repository.findOne({ where: { email } });
    }

    async findByType(type: string): Promise<Renter[]> {
        return this.repository.find({
            where: { type: type as Renter['type'] },
            relations: ['locations'],
        });
    }
}