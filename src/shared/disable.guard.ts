import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class DisabledGuard implements CanActivate {
  canActivate(): boolean {
    return false;
  }
}
