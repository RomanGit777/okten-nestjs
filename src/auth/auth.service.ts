import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Token } from './entities/token.entity';
import { ConfigService } from '@nestjs/config';
import { ITokens } from './interface/tokens-interface';
import { RefreshTokenDTO } from './dto/refresh-token.dto';
import { IJWTPayload } from './interface/jwt-payload.unterface';

@Injectable()
export class AuthService {
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly TokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      configService.get('ACCESS_TOKEN_EXPIRATION_TIME') || 0;
    this.refreshTokenExpiresIn =
      configService.get('REFRESH_TOKEN_EXPIRATION_TIME') || 0;
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    return this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<ITokens> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    const jti = Math.random().toString(36).substring(2);

    const payload = { userId: user.id, username: user.username, jti };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${this.accessTokenExpiresIn}s`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${this.refreshTokenExpiresIn}s`,
    });

    await this.saveTokens(
      user,
      accessToken,
      refreshToken,
      this.accessTokenExpiresIn,
      this.refreshTokenExpiresIn,
      jti,
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshDto: RefreshTokenDTO): Promise<ITokens> {
    //1. extract the value from the object
    const refreshToken = refreshDto.refreshToken;
    try {
      //2. verify token to check if it's valid + decode payload
      this.jwtService.verify<IJWTPayload>(refreshToken); //verify+decode payload if valid
      //3. we must confirm that this token exists in db, is not blocked, and load the owner
      const tokenEntity = await this.TokenRepository.findOne({
        where: { refreshToken, isBlocked: false },
        relations: ['user'],
      });
      //4. check for existence in db + if it's not expired
      if (!tokenEntity || tokenEntity.refreshTokenExpiresAt < new Date()) {
        throw new UnauthorizedException('Invalid or expired refresh token');
      }
      //5. Block it so it won't be possible to use it one more time
      tokenEntity.isBlocked = true;
      await this.TokenRepository.save(tokenEntity);
      //6. create unique number for new tokens
      const jti = Math.random().toString(36).substring(2);
      //7. prepare payload to sign new tokens
      const payload = {
        userId: tokenEntity.user.id,
        username: tokenEntity.user.username,
        jti,
      };
      //8. create new tokens
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: `${this.accessTokenExpiresIn}s`,
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: `${this.refreshTokenExpiresIn}s`,
      });
      //9. save new tokens in db
      await this.saveTokens(
        tokenEntity.user,
        newAccessToken,
        newRefreshToken,
        this.accessTokenExpiresIn,
        this.refreshTokenExpiresIn,
        jti,
      );
      //10. return new tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logOut(refreshTokenDTO: RefreshTokenDTO): Promise<void> {
    const { refreshToken } = refreshTokenDTO;

    const tokenEntity = await this.TokenRepository.findOne({
      where: { refreshToken, isBlocked: false },
    });

    if (tokenEntity) {
      tokenEntity.isBlocked = true;
      await this.TokenRepository.save(tokenEntity);
    }
  }

  private async saveTokens(
    user: User,
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    jti: string,
  ): Promise<void> {
    const tokenEntity = this.TokenRepository.create({
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(Date.now() + accessTokenExpiresIn * 1000),
      refreshTokenExpiresAt: new Date(
        Date.now() + refreshTokenExpiresIn * 1000,
      ),
      user,
      jti,
    });
    await this.TokenRepository.save(tokenEntity);
  }

  private async validateUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
