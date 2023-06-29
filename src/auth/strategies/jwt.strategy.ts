import { UnauthorizedException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/interfaces';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<IUser> {
    const { id } = payload;

    const user = await this.userService.findOne(id);

    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive)
      throw new UnauthorizedException('User is not active, talk with an admin');

    return user;
  }
}
