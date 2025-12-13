import { Controller, Post, Body, Inject, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto'
import { EmailService } from '../email/email.service'
import { RedisService } from '../redis/redis.service'
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });
    return '发送成功';
  }

  // 初始化数据 dome
  @Get("init-data")
  async initData() {
    await this.userService.initData()
    return 'done'
  }

  // 普通用户登录
  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto){
    const vo = await this.userService.login(loginUser, false);
    console.log(vo,'登录返回的vo')
    return vo;
  }

  // admin登录
  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto){
    const vo = await this.userService.login(loginUser, true);
    console.log(vo,'登录admin返回的vo')
    return vo;
  }
}
