import {
    IsString,
    IsEmail,
    IsEnum,
    IsOptional,
    IsPhoneNumber,
} from 'class-validator';
import { RenterType } from '../enums/renter-type.enum';

export class CreateRenterDto {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @IsOptional()
    @IsPhoneNumber()
    phone?: string;

    @IsEnum(RenterType)
    type!: RenterType;

    @IsString()
    @IsOptional()
    address?: string;
}