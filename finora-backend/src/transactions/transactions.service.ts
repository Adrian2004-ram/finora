import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { DataSource } from 'typeorm';
import { TransactionResponseDto } from './dto/transactions-response.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  // CREATE

  async create(
    createTransactionDto: CreateTransactionDto,
    userId: string,
  ): Promise<TransactionResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const transactionRepository = manager.getRepository(Transaction);

      const user = await userRepository.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const amount = createTransactionDto.amount;

      const balanceChange =
        createTransactionDto.type === 'INCOME' ? amount : -amount;

      const currentBalance = Number(user.currentBalance);

      user.currentBalance = Number((currentBalance + balanceChange).toFixed(2));

      await userRepository.save(user);

      const transaction = transactionRepository.create({
        amount,
        type: createTransactionDto.type,
        description: createTransactionDto.description,
        date: createTransactionDto.date,
        user,
      });

      await transactionRepository.save(transaction);

      return this.toDto(transaction);
    });
  }

  // FIND ALL

  async findAll(userId: string): Promise<TransactionResponseDto[]> {
    const transaction = await this.transactionRepository.find({
      where: { user: { id: userId } },
      order: {
        date: 'DESC',
        createdAt: 'DESC',
      },
    });

    return transaction.map((transaction) => this.toDto(transaction));
  }

  // FIND BY ID

  async findById(id: string, userId: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaccion no encontrada');
    }

    return this.toDto(transaction);
  }

  // DELETE TRANSACTION

  async deleteTransaction(id: string, userId: string) {
    await this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const transactionRepository = manager.getRepository(Transaction);

      const user = await userRepository.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const transaction = await transactionRepository.findOne({
        where: {
          id,
          user: { id: userId },
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaccion no encontrada');
      }

      const amount = Number(transaction.amount);

      const balanceChange = transaction.type === 'INCOME' ? -amount : amount;

      user.currentBalance = Number(
        (Number(user.currentBalance) + balanceChange).toFixed(2),
      );
      await userRepository.save(user);

      await transactionRepository.delete(id);
    });
  }

  // EDIR TRANSACTION

  async editTransaction(
    id: string,
    userId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const transactionRepository = manager.getRepository(Transaction);

      const user = await userRepository.findOne({
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const transaction = await transactionRepository.findOne({
        where: {
          id,
          user: {
            id: userId,
          },
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transacción no encontrada');
      }

      // Guardamos los valores anteriores
      const oldAmount = Number(transaction.amount);
      const oldType = transaction.type;

      // Actualizamos los datos enviados
      Object.assign(transaction, dto);

      // Si cambia amount o type, recalculamos el balance
      const newAmount = Number(transaction.amount);
      const newType = transaction.type;

      const oldBalanceChange = oldType === 'INCOME' ? oldAmount : -oldAmount;

      const newBalanceChange = newType === 'INCOME' ? newAmount : -newAmount;

      const balanceDifference = newBalanceChange - oldBalanceChange;

      user.currentBalance = Number(
        (Number(user.currentBalance) + balanceDifference).toFixed(2),
      );

      await transactionRepository.save(transaction);
      await userRepository.save(user);

      return this.toDto(transaction);
    });
  }

  private toDto(transaction: Transaction): TransactionResponseDto {
    return new TransactionResponseDto(transaction);
  }
}
