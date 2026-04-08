import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJWTPayload } from './interface/jwt-payload.unterface';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Token)
    private readonly TokenRepository: Repository<Token>,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || '';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: IJWTPayload) {
    const tokenEntity = await this.TokenRepository.findOne({
      where: { jti: payload.jti, isBlocked: false },
      relations: ['user'],
    });

    if (!tokenEntity) {
      throw new UnauthorizedException('Invalid or blocked token');
    }
    return payload;
  }
}
// This class configures how JWTs are extracted and verified.
// The validate() method runs after the JWT is verified and ensures the token exists in the database, is not blocked, and belongs to a valid user.
// If everything is valid, the decoded payload is attached to the request.
