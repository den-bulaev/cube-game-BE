import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Score } from './score.entity';

@Entity()
export class TopScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  value: number;

  @OneToMany(() => Score, (score) => score.topScore, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  score: Score;
}
