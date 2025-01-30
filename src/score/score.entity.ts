import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TopScore } from './topScore.entity';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ nullable: true })
  score: number;

  @OneToOne(() => User, (user) => user.score, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => TopScore, (topScore) => topScore.score, {
    cascade: true,
  })
  @JoinColumn()
  topScore: TopScore;
}
