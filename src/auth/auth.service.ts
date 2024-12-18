import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { IJwtPayload } from './jwt-payload.interface';
import { Score } from 'src/score/score.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersRepository.save(user);

      // Add user score
      const userScore = this.scoreRepository.create({
        userId: savedUser.id,
        score: 0,
      });

      const savedScore = await this.scoreRepository.save(userScore);

      savedUser.score = savedScore;
      await this.usersRepository.save(savedUser);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken }> {
    const { username, password } = authCredentialsDto;
    const user = await this.usersRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: IJwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    }

    throw new UnauthorizedException('Please check your login credentials');
  }
}
