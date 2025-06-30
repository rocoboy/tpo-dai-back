import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('validation_codes')
export class ValidationCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  alias: string;

  @Column()
  code: string;

  @Column()
  expiration: Date;

  @Column({ default: false })
  used: boolean;
}
