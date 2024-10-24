import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TokenResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const response = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const { accessToken, refreshToken, ...restOfData } = data;

        response.cookie('accessToken', accessToken, {
          httpOnly: true,
          maxAge: 60 * 1000,
        });

        response.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return restOfData;
      }),
    );
  }
}
