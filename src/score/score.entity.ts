import { User } from 'src/auth/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  score: number;

  @OneToOne(() => User, (user) => user.score, { onDelete: 'CASCADE' })
  user: User;
}
