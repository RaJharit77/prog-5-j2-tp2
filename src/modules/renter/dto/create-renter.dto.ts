import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { RenterType } from '../enum/renter-type.enum';

export class CreateRenterDto {
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  name!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsEnum(RenterType, {
    message: `Type must be one of: ${Object.values(RenterType).join(', ')}`,
  })
  type!: RenterType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;
}
