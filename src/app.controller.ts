import { Controller, Get, Post, Body, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo} from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata('require-login', true) //加入元数据，表示需要登录才能访问
  @RequireLogin()
  // @SetMetadata('require-permission', ['ddd']) // 加入元数据，表示需要特定权限才能访问
  @RequirePermission('bbb')
  getAaa(@UserInfo('username') username: any, @UserInfo() userInfo: any): string {
    return 'This is aaa endpoint';
  }

  @Post('bbb')
  postBbb(@Body() body: any): string {
    return `Received data: ${JSON.stringify(body)}`;
  }
}
