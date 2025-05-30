import { Request } from 'express';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserDTO } from '@sample/shared';

interface RequestWithUser extends Request {
  user: UserDTO;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDTO => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
