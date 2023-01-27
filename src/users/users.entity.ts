import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(` inserted with the id ${this.id} `);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(` inserted wuth the id ${this.id} `);
  }

  @AfterRemove()
  logRemove() {
    console.log(` User with ${this.id} is removed! `);
  }
}
