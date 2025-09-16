import { IsString, IsNumber, IsInt, Min, Max, Length } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  @Length(1, 100)
  applicantName: string;

  @IsString()
  propertyAddress: string;

  @IsInt()
  @Min(300)
  @Max(850)
  creditScore: number;

  @IsNumber()
  @Min(0)
  monthlyIncome: number;

  @IsNumber()
  @Min(1)
  requestedAmount: number;

  @IsInt()
  @Min(1)
  loanTermMonths: number;
}
