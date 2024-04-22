import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaperEntity } from './paper.entity';
import { Repository } from 'typeorm';
import { CreatePaperDto } from './dtos';
import { CommonService } from 'src/common/common.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class PaperService {
  constructor(
    @InjectRepository(PaperEntity)
    private readonly papersRepository: Repository<PaperEntity>,
    private readonly commonService: CommonService,
  ) {}

  public async create(
    dto: CreatePaperDto,
    user: UserEntity,
  ): Promise<PaperEntity> {
    const { title, contentHtml, contentText, summarization, hashtags } = dto;
    const url = this.convertTitleToUrl(title);

    await this._checkUrlUniqueness(url);

    const paper = this.papersRepository.create({
      authorId: user.id,
      hashtags: hashtags,
      htmlContent: contentHtml,
      title: title,
      textContent: contentText,
      summarization,
      url,
    });

    await this.commonService.saveEntity(this.papersRepository, paper, true);
    return paper;
  }

  public async getPaperByUrl(url: string): Promise<PaperEntity> {
    const paper = await this.papersRepository.findOne({ where: { url } });
    if (!paper) {
      throw new NotFoundException('Paper was not found!');
    }

    return paper;
  }

  private convertTitleToUrl(title: string) {
    // Replace any characters that are not letters or spaces with empty strings
    const sanitizedTitle = title.replace(/[^a-zA-Z\s]/g, '');

    // Split the sanitized title into individual words
    const words = sanitizedTitle.split(' ');

    // Convert each word to lowercase and join with dashes
    const url = words.map((word) => word.toLowerCase()).join('-');

    return url;
  }

  private async _checkUrlUniqueness(url: string): Promise<void> {
    const count = await this.papersRepository.count({ where: { url } });
    if (count > 0) {
      throw new ConflictException('Invalid title, try another');
    }
  }
}
