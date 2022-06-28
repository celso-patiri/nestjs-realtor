import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}

@Injectable()
//This guard is executed in every route, defined in app.module
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1 - Determine user types that can execute the called endpoint
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    //if route has no role restriction
    if (!roles || !roles.length) return true;

    // 2 - Grab JWT from request header and verify it
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // 3 - Fetch information about the user in database
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
      });
      if (!user) return false;

      // 4 - Determine if user has permissions
      if (!roles.includes(user.user_type)) return false;
    } catch (err) {
      return false;
    }
    return true;
  }
}
