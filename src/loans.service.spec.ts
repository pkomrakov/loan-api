import { Test, TestingModule } from '@nestjs/testing';
import { LoansService } from './loans.service';
import { CrimeGradeService, CrimeGrade } from './crime-grade.service';
import { PrismaService } from './prisma.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { Loan } from '@prisma/client';

describe('LoansService', () => {
  let service: LoansService;
  let crimeGradeService: CrimeGradeService;
  let prismaService: PrismaService;

  const mockCreateLoanDtoSuccessful: CreateLoanDto = {
    applicantName: 'John Doe',
    propertyAddress: '123 Main St',
    creditScore: 750,
    monthlyIncome: 5000,
    requestedAmount: 200000,
    loanTermMonths: 360,
  };

  const mockLoan: Loan = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    ...mockCreateLoanDtoSuccessful,
    eligible: true,
    reason: 'Passed all checks',
    crimeGrade: CrimeGrade.A,
    createdAt: new Date(),
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

    const module: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    service = module.get<LoansService>(LoansService);
    crimeGradeService = module.get<CrimeGradeService>(CrimeGradeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('loanById', () => {
    it('should return a loan when found', async () => {
      const findUniqueSpy = jest
        .spyOn(prismaService.loan, 'findUnique')
        .mockResolvedValue(mockLoan);

      const result = await service.loanById(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toEqual(mockLoan);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });

    it('should return null when loan not found', async () => {
      const findUniqueSpy = jest
        .spyOn(prismaService.loan, 'findUnique')
        .mockResolvedValue(null);

      const result = await service.loanById(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
    });
  });

  describe('processLoan', () => {
    it('should process loan successfully when all validations pass', async () => {
      jest
        .spyOn(crimeGradeService, 'crimeGradeCheck')
        .mockResolvedValue(CrimeGrade.A);

      const result = await service.processLoan(mockCreateLoanDtoSuccessful);

      expect(result).toEqual({
        ...mockCreateLoanDtoSuccessful,
        crimeGrade: CrimeGrade.A,
        reason: 'Passed all checks',
        eligible: true,
      });
    });

    it('should reject loan when crime grade is F', async () => {
      jest
        .spyOn(crimeGradeService, 'crimeGradeCheck')
        .mockResolvedValue(CrimeGrade.F);

      const result = await service.processLoan(mockCreateLoanDtoSuccessful);

      expect(result).toEqual({
        ...mockCreateLoanDtoSuccessful,
        crimeGrade: CrimeGrade.F,
        reason: 'Crime grade too low',
        eligible: false,
      });
    });

    it('should reject loan when credit score is too low', async () => {
      const lowCreditScoreDto = {
        ...mockCreateLoanDtoSuccessful,
        creditScore: 650,
      };
      jest
        .spyOn(crimeGradeService, 'crimeGradeCheck')
        .mockResolvedValue(CrimeGrade.A);

      const result = await service.processLoan(lowCreditScoreDto);

      expect(result).toEqual({
        ...lowCreditScoreDto,
        crimeGrade: CrimeGrade.A,
        reason: 'Credit score too low',
        eligible: false,
      });
    });

    it('should reject loan when monthly income is too low', async () => {
      const lowIncomeDto = {
        ...mockCreateLoanDtoSuccessful,
        monthlyIncome: 1000,
        requestedAmount: 500000,
        loanTermMonths: 360,
      };
      jest
        .spyOn(crimeGradeService, 'crimeGradeCheck')
        .mockResolvedValue(CrimeGrade.A);

      const result = await service.processLoan(lowIncomeDto);

      // Calculate expected monthly payment: 500000 / 360 * 1.5 = 2083.33
      // Monthly income 1000 is less than 2083.33, so should be rejected
      expect(result).toEqual({
        ...lowIncomeDto,
        crimeGrade: CrimeGrade.A,
        reason: 'Monthly income too low',
        eligible: false,
      });
    });
  });
});
