import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionType } from "../enums/transaction-type.enum";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'decimal',
        precision: 12,
        scale: 2,
    })
    amount!: number;

    @Column({
        type: 'enum',
        enum: TransactionType,
    })
    type!: TransactionType;

    @Column({
        type: 'varchar',
        length: 255,
    })
    description!: string;

    @Column({
        type: 'date'
    })
    date!: string;

    @ManyToOne(() => User, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}