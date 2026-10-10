import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
import { TransactionType } from "../enums/transaction-type.enum";


export class CreateTransactionDto {

    @IsNumber({ maxDecimalPlaces: 2 })
    amount!: number;

    @IsEnum(TransactionType)
    type!: TransactionType;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    description!: string;

    @IsDateString()
    date!: string;

}