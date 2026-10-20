import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsController } from './transactions.controller';
import { User } from 'src/users/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User, Category]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
