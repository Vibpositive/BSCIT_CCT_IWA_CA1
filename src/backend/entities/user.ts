import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Vote } from "./vote";
import { Link } from "./link";
import { Comment } from "./comment";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;
  @Column({ unique: true })
  public email!: string;
  @Column()
  public password!: string;
  
  @OneToMany(() => Link, (link: Link) => link.user )
  public link: Link[];

  @OneToMany(type => Comment, comment => comment.user)
  public comment!: Comment[];

  @OneToMany(type => Vote, vote => vote.user)
  public vote!: Vote[];
}
