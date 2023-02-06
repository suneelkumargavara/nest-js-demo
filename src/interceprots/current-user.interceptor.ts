import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from '../users/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    console.log('current user interceptor got called');
    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }
    return handler.handle();
  }
}
