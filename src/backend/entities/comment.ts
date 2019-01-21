// /src/backend/entities/comment.ts.
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {

    @PrimaryGeneratedColumn()
    public id!: number;

    @Column()
    public user!: string;

    @Column()
    public link!: string;

    @Column("text")
    public comment!: string;
}