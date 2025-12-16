import { Module } from '@nestjs/common';
// 从 '@nestjs/typeorm' 包中导入 TypeOrmModule 模块，用于数据库连接和操作
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config'; // 配置迁全局配置
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env', // 
    }),
    // 调用 TypeOrmModule 的 forRoot 方法，初始化根数据库连接配置
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'mysql',                    // 指定数据库类型为 MySQL
          host: configService.get('mysql_server_host'),                // 指定数据库主机地址为本地主机
          port: configService.get('mysql_server_port'),                       // 指定数据库端口号为 3306（MySQL 默认端口）
          username: configService.get('mysql_server_username'),                 // 指定数据库用户名为 root
          password: configService.get('mysql_server_password'),                     // 指定数据库密码为空（默认 MySQL 安装）
          database: configService.get('mysql_server_database'), // 指定要连接的数据库名称
          entities: [Role, Permission, User],                     // 指定数据库实体列表
          synchronize: false,                // 启用数据库同步功能，自动创建和更新表结构（生产环境不推荐）
          logging: true,                    // 启用数据库操作日志记录，输出所有 SQL 查询语句
          poolSize: 10,                     // 指定数据库连接池的大小为 10，限制最大连接数
          connectorPackage: 'mysql2',       // 指定使用 mysql2 作为 MySQL 连接器包
        }
      },
      inject: [ConfigService]
    }),
    JwtModule.registerAsync({
      global:true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: '30m' // 默认 30 分钟
          }
        }
      },
      inject: [ConfigService]
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }