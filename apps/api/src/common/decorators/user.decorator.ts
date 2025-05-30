import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
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
