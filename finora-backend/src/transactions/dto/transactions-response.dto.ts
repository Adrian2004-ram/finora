import { Transaction } from '../entities/transaction.entity';
import { TransactionType } from '../enums/transaction-type.enum';

export class TransactionResponseDto {
  id!: string;
  amount!: number;
  type!: TransactionType;
  description!: string;
  date!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.amount = Number(transaction.amount);
    this.type = transaction.type;
    this.description = transaction.description;
    this.date = transaction.date;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
