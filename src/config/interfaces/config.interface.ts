import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { IJwt } from './jwt.interface';
import { IEmailConfig } from './email-config.interface';

export interface IConfig {
  id: string;
  port: number;
  domain: string;
  db: MikroOrmModuleOptions;
  jwt: IJwt;
  emailService: IEmailConfig;
}
