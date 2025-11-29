import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Location } from '../../location/entity/location.entity';
import { RenterType } from '../enum/renter-type.enum';

@Entity('renters')
export class Renter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone!: string;

  @Column({
    type: 'varchar',
    enum: RenterType,
    default: RenterType.INDIVIDUAL,
  })
  type!: RenterType;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @OneToMany(() => Location, (location) => location.renter)
  locations!: Location[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
