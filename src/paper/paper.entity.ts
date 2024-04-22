import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IPaper } from './interfaces/paper.interface';
import { IsString, MinLength } from 'class-validator';

@Entity()
@Unique(['paperId', 'url'])
export class PaperEntity implements IPaper {
  @PrimaryGeneratedColumn('uuid')
  paperId: string;

  @Column('numeric')
  authorId: number;

  @Column({ type: 'varchar' })
  @IsString()
  url: string;

  @Column({ type: 'varchar' })
  @IsString()
  title: string;

  @Column({ type: 'varchar' })
  @IsString()
  @MinLength(100)
  textContent: string;

  @Column({ type: 'varchar' })
  @IsString()
  htmlContent: string;

  @Column('text', { array: true })
  hashtags: string[] = [];

  @Column({ type: 'varchar' })
  @IsString()
  summarization: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date = new Date();
}
