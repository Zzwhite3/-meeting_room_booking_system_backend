import { CanActivate, ExecutionContext, Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {
  
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest(); // 获取请求对象

    if(!request.user){
      return true;
    }

    const permissions = request.user.permissions; // 获取用户权限列表
    
    // 获取当前处理程序或类上定义的所需权限元数据
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
      context.getClass(),
      context.getHandler()
    ])

    if(!requiredPermissions) {
      return true;
    }

    // 遍历程序或类的所需权限，检查用户是否具有这些权限
    for(let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find(item => item.code === curPermission);
      if(!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }
    
    return true;
  }
}
