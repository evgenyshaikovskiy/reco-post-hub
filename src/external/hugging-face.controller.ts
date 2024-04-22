import { Body, Controller, Get, Post } from '@nestjs/common';
import { CorrectGrammarDto } from './dtos/correct-grammar.dto';

@Controller('external')
export class HuggingFaceController {
  constructor() {}

  @Post('/correct-grammar')
  public async correctGrammar(@Body() correctGrammarDto: CorrectGrammarDto) {
    const data = {
      inputs: `${correctGrammarDto.text}`,
    };

    const util = async (data: any) => {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/vennify/t5-base-grammar-correction',
        {
          headers: {
            Authorization: 'Bearer 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',
          },
          method: 'POST',
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      return result;
    };

    const result = await util(data);

    return result;
  }
}
