import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HashtagService } from './hashtag/hashtag.service';
import { HashtagSimilarityService } from './hashtag-similarity/hashtag-similarity.service';

export interface HuggingFaceSemanticSimilarityInput {
  inputs: {
    source_sentence: string;
    sentences: string[];
  };
}

export interface HuggingFaceSemanticSimilarityResult {
  source: string;
  results: string[];
}

@Injectable()
export class RecommendationService implements OnModuleInit {
  private readonly logger = new Logger(RecommendationService.name);
  private readonly huggingFaceToken =
    this.configService.get<string>('huggingFaceToken');

  constructor(
    private readonly configService: ConfigService,
    private readonly hashtagService: HashtagService,
    private readonly hashtagSimilarityService: HashtagSimilarityService,
  ) {}

  onModuleInit() {}

  @Cron(CronExpression.EVERY_HOUR)
  async updateUsersRecommendations() {
    this.logger.log('Begin reevaluation for all hashtags in database');
    const hashtags = await this.hashtagService.getHashtags();
    const inputs = this.prepareData(hashtags.map((hs) => hs.name));

    const results = await Promise.all(
      inputs.map((input) => this._getMetrics(input)),
    );

    this.logger.log(`Finished reevaluation of hashtags`);

    const entityResultMapping = results.map((result) => {
      const entity = hashtags.find((hs) => hs.name === result.source);
      if (entity) {
        return { entity, similarityArray: result.results };
      }
    });

    console.log(entityResultMapping);

    await Promise.all(
      entityResultMapping.map((dto) =>
        this.hashtagSimilarityService.add(dto.entity, dto.similarityArray),
      ),
    );

    this.logger.log('Finished updating similarities in database');
  }

  private prepareData(
    hashtags: string[],
  ): HuggingFaceSemanticSimilarityInput[] {
    const data: HuggingFaceSemanticSimilarityInput[] = [];
    for (let i = 0; i < hashtags.length; i++) {
      data.push({
        inputs: {
          source_sentence: hashtags[i],
          sentences: hashtags.filter((_, idx) => i !== idx),
        },
      });
    }

    return data;
  }

  private async _getMetrics(
    data: HuggingFaceSemanticSimilarityInput,
  ): Promise<HuggingFaceSemanticSimilarityResult> {
    const util = async (data: HuggingFaceSemanticSimilarityInput) => {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2`,
        {
          headers: {
            Authorization: this.huggingFaceToken,
          },
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      return await response.json();
    };

    const metrics: number[] = await util(data);

    this.logger.log(
      `Received metrics for ${data.inputs.source_sentence}: ${metrics}`,
    );

    const metricsJoinedHashtags = data.inputs.sentences.map((str, idx) =>
      metrics[idx] ? `${str}:${metrics[idx]}` : '',
    );

    this.logger.log(`Mapped results: ${metricsJoinedHashtags}`);

    return {
      source: data.inputs.source_sentence,
      results: metricsJoinedHashtags,
    };
  }
}
