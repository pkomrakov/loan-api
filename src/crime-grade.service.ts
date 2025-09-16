import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum CrimeGrade {
  A = 'A',
  A_PLUS = 'A+',
  A_MINUS = 'A-',
  B = 'B',
  B_PLUS = 'B+',
  B_MINUS = 'B-',
  C = 'C',
  C_PLUS = 'C+',
  C_MINUS = 'C-',
  D = 'D',
  D_PLUS = 'D+',
  D_MINUS = 'D-',
  F = 'F',
}

@Injectable()
export class CrimeGradeService {
  constructor(private readonly configService: ConfigService) {}

  async crimeGradeCheck(address: string): Promise<CrimeGrade | undefined> {
    const crimeGrade = await this.queryFlowise(address);
    return crimeGrade;
  }

  private async queryFlowise(
    question: string,
  ): Promise<CrimeGrade | undefined> {
    const response = await fetch(
      'https://cloud.flowiseai.com/api/v1/prediction/e7a65a56-1f6e-4ad0-8321-607bd4a9f05f',
      {
        headers: {
          Authorization: 'Bearer ' + this.configService.get('FLOWISE_API_KEY'),
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ question }),
      },
    );
    const result = (await response.json()) as {
      text: string;
    };
    if (!Object.values(CrimeGrade).includes(result.text as CrimeGrade)) {
      return;
    }
    return result.text as CrimeGrade;
  }
}
