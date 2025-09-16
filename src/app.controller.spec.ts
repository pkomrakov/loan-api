import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { LoansService } from './loans.service';
import { CrimeGradeService, CrimeGrade } from './crime-grade.service';
import { PrismaService } from './prisma.service';
import { NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ConfigService } from '@nestjs/config';
import { Loan } from '@prisma/client';

describe('AppController', () => {
  let controller: AppController;
  let loansService: LoansService;

  const mockLoan: Loan = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    applicantName: 'John Doe',
    propertyAddress: '123 Main St',
    creditScore: 750,
    monthlyIncome: 5000,
    requestedAmount: 200000,
    loanTermMonths: 360,
    crimeGrade: CrimeGrade.A,
    reason: 'Passed all checks',
    eligible: true,
    createdAt: new Date(),
  };

  const mockCreateLoanDto: CreateLoanDto = {
    applicantName: 'John Doe',
    propertyAddress: '123 Main St',
    creditScore: 750,
    monthlyIncome: 5000,
    requestedAmount: 200000,
    loanTermMonths: 360,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      loan: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const mockCrimeGradeService = {
      crimeGradeCheck: jest.fn(),
    };

    const mockConfigService = {
      get: jest.fn().mockReturnValue('test-api-key'),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        LoansService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CrimeGradeService,
          useValue: mockCrimeGradeService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    loansService = module.get<LoansService>(LoansService);
  });

  describe('GET /loan/:id', () => {
    it('should return a loan when found', async () => {
      const loanId = '123e4567-e89b-12d3-a456-426614174000';
      const loanByIdSpy = jest
        .spyOn(loansService, 'loanById')
        .mockResolvedValue(mockLoan);

      const result = await controller.getPostById(loanId);

      expect(result).toEqual(mockLoan);
      expect(loanByIdSpy).toHaveBeenCalledWith(loanId);
    });

    it('should throw NotFoundException when loan is not found', async () => {
      const loanId = '123e4567-e89b-12d3-a456-426614174000';
      const loanByIdSpy = jest
        .spyOn(loansService, 'loanById')
        .mockResolvedValue(null);

      await expect(controller.getPostById(loanId)).rejects.toThrow(
        NotFoundException,
      );
      expect(loanByIdSpy).toHaveBeenCalledWith(loanId);
    });
  });

  describe('POST /loan', () => {
    it('should create a loan successfully', async () => {
      const createLoanSpy = jest
        .spyOn(loansService, 'createLoan')
        .mockResolvedValue(mockLoan);

      const result = await controller.createLoan(mockCreateLoanDto);

      expect(result).toEqual(mockLoan);
      expect(createLoanSpy).toHaveBeenCalledWith(mockCreateLoanDto);
    });
  });
});
