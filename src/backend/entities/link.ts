// /src/backend/entities/link.ts.
// This file should define the Link entity. 
// It should contain an ID, a reference to the User an URL and a title.

import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    public id!: number;
    @Column()
    public url!: string;
    @Column()
    public title!: string;
}