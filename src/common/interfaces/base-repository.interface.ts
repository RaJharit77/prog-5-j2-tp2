export interface IBaseRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: number): Promise<T | null>;
    create(entity: Partial<T>): Promise<T>;
    update(id: number, entity: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<boolean>;
}