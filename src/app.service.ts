import {
  Injectable,
  Logger,
  LoggerService,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly loggerService: LoggerService;

  constructor() {
    this.loggerService = new Logger(AppService.name);
  }

  public async onModuleInit() {
    this.loggerService.log('AppModule module init.');
  }

  public async onModuleDestroy() {
    this.loggerService.log('AppModule destroyed.');
  }
}
