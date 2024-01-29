import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  LoggerService,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { isNull, isUndefined } from './utils/validation.util';
import slugify from 'slugify';
import { IMessage } from './interfaces/message.interface';
import { v4 } from 'uuid';
import { Repository } from 'typeorm';

@Injectable()
export class CommonService {
  private readonly postgresDuplicateCodeError: string = '23505';
  private readonly duplicateErrorMessageDefault: string =
    'Duplicated value in database';

  private readonly loggerService: LoggerService;

  constructor() {
    this.loggerService = new Logger(CommonService.name);
  }

  /**
   * Validates an entities with the class-validator library
   * @param entity entity to validate
   */
  public async validateEntity(entity: object): Promise<void> {
    const errors = await validate(entity);
    const messages: string[] = [];

    for (const error of errors) {
      messages.push(...Object.values(error.constraints));
    }

    if (errors.length > 0) {
      throw new BadRequestException(messages.join(', \n'));
    }
  }

  /**
   * Checks if a findOne query didn't return null or undefined
   * @param entity - founded entity
   * @param name - entity name
   */
  public checkEntityExistence<T extends object>(
    entity: T | null | undefined,
    name: string,
  ): void {
    if (isNull(entity) || isUndefined(entity)) {
      throw new NotFoundException(`${name} not found`);
    }
  }

  /**
   * Save entity
   * @param repo - repository for entity
   * @param entity - entity to save
   * @param isNew - indicates whether entity is new
   */
  public async saveEntity<T extends object>(
    repo: Repository<T>,
    entity: T,
    isNew = false,
  ): Promise<void> {
    await this.validateEntity(entity);
    if (isNew) {
      await repo.save(entity);
    } else {
      await this.throwDuplicateError(repo.save(entity));
    }
  }

  /**
   * Removes entity
   * @param repo - repository for entity
   * @param entity - entity
   */
  public async removeEntity<T extends object>(
    repo: Repository<T>,
    entity: T,
  ): Promise<void> {
    await this.throwInternalError(repo.delete(entity));
  }

  /**
   * Checks is an error is of the code 23505, PostgreSQL's duplicate value error,
   * and throws a conflict exception
   * @param promise promise to check for error
   * @param message error message
   */
  public async throwDuplicateError<T>(promise: Promise<T>, message?: string) {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);

      if ((error.code = this.postgresDuplicateCodeError)) {
        throw new ConflictException(
          message ?? this.duplicateErrorMessageDefault,
        );
      }

      throw new BadRequestException(error.message);
    }
  }

  /**
   * Function to abstract throwing internal server exception
   * @param promise promise to fulfill
   */
  public async throwInternalError<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.loggerService.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Formats text to uppercase all letters
   * @param title - text to format
   * @returns - formatted string
   */
  public formatName(title: string): string {
    return title
      .trim()
      .replace(/\n/g, ' ')
      .replace(/\s\s+/g, ' ')
      .replace(/\w\S*/g, (w) => w.replace(/^\w/, (l) => l.toUpperCase()));
  }

  public generatePointSlug(str: string): string {
    return slugify(str, { lower: true, replacement: '.', remove: /['_\.\-]/g });
  }

  public generateMessage(message: string): IMessage {
    return { id: v4(), message };
  }
}
