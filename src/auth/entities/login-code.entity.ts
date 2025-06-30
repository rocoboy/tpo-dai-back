import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('login_codes')
export class LoginCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column()
  expiration: Date;

  @Column({ default: false })
  used: boolean;
}