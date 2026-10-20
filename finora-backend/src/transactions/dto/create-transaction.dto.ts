import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator";
import { TypeTransaction } from "../enums/type-transaction.enum";


export class CreateTransactionDto {

    @IsNumber({ maxDecimalPlaces: 2 })
    amount!: number;

    @IsEnum(TypeTransaction)
    type!: TypeTransaction;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    description!: string;

    @IsDateString()
    date!: string;

    @IsOptional()
    @IsUUID()
    categoryId!: string;

}