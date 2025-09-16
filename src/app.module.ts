import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';
import { LoansService } from './loans.service';
import { CrimeGradeService } from './crime-grade.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [LoansService, PrismaService, CrimeGradeService],
})
export class AppModule {}
