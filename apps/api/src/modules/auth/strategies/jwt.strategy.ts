import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '@supabase/supabase-js';
import { UserDTO } from '@sample/shared';

import { config } from '@/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config().SUPABASE_JWT_SECRET,
    });
  }

  validate(payload: JwtPayload): UserDTO {
    const user: UserDTO = {
      userId: payload.sub,
      email: (payload.email as string) ?? '',
    };

    return user;
  }
}
