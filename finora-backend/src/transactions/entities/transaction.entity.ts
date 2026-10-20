import { User } from "src/users/entities/user.entity";
import { Category } from "src/category/entities/category.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TypeTransaction } from "../enums/type-transaction.enum";

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
        enum: TypeTransaction,
    })
    type!: TypeTransaction;

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

    @ManyToOne(() => Category, (category) => category.transactions, {
        nullable: true,
        onDelete: 'RESTRICT',
    })
    category!: Category | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}