import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ClearCookiesInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const request = ctx.switchToHttp().getRequest();
    const response = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map(() => {
        if (request.cookies.accessToken) response.clearCookie('accessToken');

        if (request.cookies.refreshToken) response.clearCookie('refreshToken');

        return;
      }),
    );
  }
}
