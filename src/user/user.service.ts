import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { RedisService } from '../redis/redis.service'

@Injectable()
export class UserService {
    private logger = new Logger();

    @InjectRepository(User)
    private userRepository: Repository<User>;

    @Inject(RedisService)
    private redisService: RedisService
    async register(user: RegisterUserDto) {
        const captcha = await this.redisService.get(`captcha_${user.email}`)

        // 失效
        if(!captcha){
            throw new  HttpException('验证码已经失效', HttpStatus.BAD_REQUEST)
        }
        // 过期
        if(user.captcha !== captcha){
            throw new  HttpException('验证码已经过期', HttpStatus.BAD_REQUEST)
        }
        // 重名
        const foundUser = await this.userRepository.findOneBy({
            name: user.username
        });
        if(foundUser) {
            throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
        }

        // 注册
        const newUser = new User();
        newUser.name = user.username;
        newUser.password = md5(user.password);
        newUser.email = user.email;
        newUser.nickName = user.nickName;
        try {
            await this.userRepository.save(newUser)
            return '注册成功';
        } catch (error) {
            this.logger.error(error, UserService)
            return "注册失败"
        }
    }
}
