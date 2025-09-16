import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan as LoanModel } from '@prisma/client';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApiKeyGuard } from './guards/api-key.guard';

@Controller()
@UseGuards(ApiKeyGuard)
export class AppController {
  constructor(private readonly loanService: LoansService) {}

  @Get('loan/:id')
  async getPostById(
    @Param('id', new ParseUUIDPipe())
    id: string,
  ): Promise<LoanModel> {
    const loan = await this.loanService.loanById(id);
    if (!loan) {
      throw new NotFoundException('Loan not found');
    }
    return loan;
  }

  @Post('loan')
  async createLoan(@Body() data: CreateLoanDto): Promise<LoanModel> {
    try {
      return await this.loanService.createLoan(data);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}
