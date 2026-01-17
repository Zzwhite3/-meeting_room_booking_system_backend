import { SetMetadata } from "@nestjs/common";
import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { Request } from "express";

// 定义一个自定义装饰器 RequireLogin，用于标记需要登录才能访问的路由处理程序或类
export const  RequireLogin = () => SetMetadata('require-login', true);

// 定义一个自定义装饰器 RequirePermission，用于标记需要特定权限才能访问的路由处理程序或类
export const  RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);

// 定义一个自定义参数装饰器 UserInfo，用于从请求对象中提取用户信息
//可以理解方法吧
export const UserInfo = createParamDecorator(
    // 当前回调函数的参数 data 是装饰器传入的参数，ctx 是执行上下文
  (val: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>(); // 获取请求对象

    if(!request.user) {
        return null;
    }
    return val ? request.user[val] : request.user; // 根据传入的参数返回对应的用户信息字段或整个用户对象 
  },
)