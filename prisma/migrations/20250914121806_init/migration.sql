-- CreateTable
CREATE TABLE "public"."Loan" (
    "id" TEXT NOT NULL,
    "applicantName" TEXT NOT NULL,
    "propertyAddress" TEXT NOT NULL,
    "eligible" BOOLEAN NOT NULL,
    "reason" TEXT NOT NULL,
    "creditScore" INTEGER NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "requestedAmount" DOUBLE PRECISION NOT NULL,
    "loanTermMonths" INTEGER NOT NULL,
    "crimeGrade" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Loan_pkey" PRIMARY KEY ("id")
);
