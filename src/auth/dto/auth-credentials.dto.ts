import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s)/, {
    message: "password doesn't match criteria",
  })
  password: string;
}
