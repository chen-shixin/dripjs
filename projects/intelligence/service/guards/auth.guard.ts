import { ConfigIntelServer } from '@dripjs/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const client = context.switchToWs().getClient();
      const username = client.handshake.headers['username'];
      const password = client.handshake.headers['password'];

      if (!username || !password) {
        throw new Error('Auth info not found.');
      }
      // tslint:disable-next-line
      const config: ConfigIntelServer = require('config').container.intelService;
      if (config.username !== username || config.password !== password) {
        throw new Error('Authentication failed.');
      }
    } catch (e) {
      // TODO: output log
      // console.error(e.message);
      return false;
    }

    return true;
  }
}
