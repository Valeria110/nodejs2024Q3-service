import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const [type, token] = req.headers.authorization?.split(' ') ?? [];

      if (type !== 'Bearer' || !token) {
        throw new UnauthorizedException('Invalid token or token type');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      req.user = payload;
    } catch (err) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
