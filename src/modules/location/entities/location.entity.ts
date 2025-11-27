import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Renter } from '../../renter/entities/renter.entity';
import { LocationType } from '../enums/location-type.enum';

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price!: number;

    @Column({
        type: 'varchar',
        enum: LocationType,
        default: LocationType.CAR,
    })
    type!: LocationType;

    @Column({ type: 'boolean', default: true })
    isAvailable!: boolean;

    @ManyToOne(() => Renter, (renter) => renter.locations)
    @JoinColumn({ name: 'renterId' })
    renter!: Renter;

    @Column()
    renterId!: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}