import { IJwt } from './jwt.interface';
import { IEmailConfig } from './email-config.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: TypeOrmModuleOptions;
  jwt: IJwt;
  emailService: IEmailConfig;
}
