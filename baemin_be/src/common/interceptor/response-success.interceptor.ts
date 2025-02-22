import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

import { Reflector } from '@nestjs/core';
import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator';
import { responseSuccess } from '../helpers/response.helper';

@Injectable()
export class ResponseSuccessInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  private readonly logger = new Logger();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const message = this.reflector.getAllAndOverride<string>(
          RESPONSE_MESSAGE,
          [context.getHandler(), context.getClass()],
        );
        const result = responseSuccess(data, message);
        return result;
      }),
    );
  }
}
