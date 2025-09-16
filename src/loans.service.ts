import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Loan, Prisma } from '@prisma/client';
import { CreateLoanDto } from './dto/create-loan.dto';
import { CrimeGradeService, CrimeGrade } from './crime-grade.service';

@Injectable()
export class LoansService {
  constructor(
    private prisma: PrismaService,
    private crimeGradeService: CrimeGradeService,
  ) {}

  async loanById(id: string): Promise<Loan | null> {
    return this.prisma.loan.findUnique({
      where: { id },
    });
  }

  async createLoan(data: CreateLoanDto): Promise<Loan> {
    const processedData = await this.processLoan(data);
    return this.prisma.loan.create({ data: processedData });
  }

  async processLoan(loan: CreateLoanDto): Promise<Prisma.LoanCreateInput> {
    const reasons: string[] = [];
    const crimeGrade = await this.crimeGradeService.crimeGradeCheck(
      loan.propertyAddress,
    );
    if (!crimeGrade) {
      throw new Error('Failed to get crime grade');
    }
    if (crimeGrade === CrimeGrade.F) {
      reasons.push('Crime grade too low');
    }
    if (loan.creditScore < 700) {
      reasons.push('Credit score too low');
    }
    if (
      loan.monthlyIncome <=
      (loan.requestedAmount / loan.loanTermMonths) * 1.5
    ) {
      reasons.push('Monthly income too low');
    }
    const eligible = reasons.length === 0;
    const result: Prisma.LoanCreateInput = {
      ...loan,
      crimeGrade,
      reason: eligible ? 'Passed all checks' : reasons.join(', '),
      eligible: eligible,
    };
    return result;
  }
}
