import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class ResetPasswordToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'reset_password_token' })
  resetPasswordToken: string;

  @Column({ name: 'exp_date' })
  expDate: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
