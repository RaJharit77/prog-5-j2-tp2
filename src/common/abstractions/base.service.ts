import { Logger } from '@nestjs/common';
import { IBaseService } from '../interfaces/base-service.interface';

export abstract class BaseService<T> implements IBaseService<T> {
  protected readonly logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  abstract findAll(): Promise<T[]>;
  abstract findById(id: number): Promise<T | null>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(id: number, entity: Partial<T>): Promise<T | null>;
  abstract delete(id: number): Promise<boolean>;
}
