import { Transaction } from '../entities/transaction.entity';
import { TypeTransaction } from '../enums/type-transaction.enum';

export class TransactionResponseDto {
  id!: string;
  amount!: number;
  type!: TypeTransaction;
  description!: string;
  date!: string;
  categoryId!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(transaction: Transaction) {
    this.id = transaction.id;
    this.amount = Number(transaction.amount);
    this.type = transaction.type;
    this.description = transaction.description;
    this.date = transaction.date;
    this.categoryId = transaction.category?.id ?? null ;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
