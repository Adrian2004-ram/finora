import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthenticatedUser } from 'src/auth/interfaces/authenticated-user.interface';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.transactionsService.create(
      createTransactionDto,
      req.user.userId,
    );
  }

  @Get()
  listTransactions(
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.transactionsService.findAll(req.user.userId);
  }

  @Get(':id')
  findTransaction(
    @Param('id') id: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.transactionsService.findById(id, req.user.userId);
  }

  @Delete(':id')
  deleteTransaction(
    @Param('id') id: string,
    @Req() req: { user: AuthenticatedUser },
  ) {
    return this.transactionsService.deleteTransaction(id, req.user.userId);
  }

  @Patch(':id')
  editTransaction(
    @Param('id') id: string,
    @Req() req: { user: AuthenticatedUser },
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionsService.editTransaction(id, req.user.userId, dto);
  }
}
