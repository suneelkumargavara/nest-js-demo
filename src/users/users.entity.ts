import { Report } from '../reports/reports.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AfterInsert, AfterUpdate, AfterRemove, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
