import { Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ISettings } from "../interfaces/settings.interface";
import { IsBoolean } from "class-validator";

@Entity()
export class SettingsEmbeddable implements ISettings {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @IsBoolean()
  showBio: boolean = false;

  @IsBoolean()
  showEmail: boolean = false;

  @IsBoolean()
  showUserSubscriptions: boolean = false;

  @IsBoolean()
  showHashtagSubscriptions: boolean = false;

  @IsBoolean()
  showComments: boolean = false;

  @IsBoolean()
  showKarma: boolean = false;

  @IsBoolean()
  showRating: boolean = false;

  @IsBoolean()
  showScores: boolean = false;

  @UpdateDateColumn()
  public updatedAt: Date;
}