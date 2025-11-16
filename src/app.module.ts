import { Module } from '@nestjs/common';
// 从 '@nestjs/typeorm' 包中导入 TypeOrmModule 模块，用于数据库连接和操作
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 调用 TypeOrmModule 的 forRoot 方法，初始化根数据库连接配置
    TypeOrmModule.forRoot({
      type: 'mysql',                    // 指定数据库类型为 MySQL
      host: 'localhost',                // 指定数据库主机地址为本地主机
      port: 3306,                       // 指定数据库端口号为 3306（MySQL 默认端口）
      username: 'root',                 // 指定数据库用户名为 root
      password: 'password',             // 指定数据库密码为 'password'
      database: 'meeting_room_booking_system', // 指定要连接的数据库名称
      entities: [],                     // 指定数据库实体列表，当前为空数组
      synchronize: true,                // 启用数据库同步功能，自动创建和更新表结构（生产环境不推荐）
      logging: true,                    // 启用数据库操作日志记录，输出所有 SQL 查询语句
      poolSize: 10,                     // 指定数据库连接池的大小为 10，限制最大连接数
      connectorPackage: 'mysql2',       // 指定使用 mysql2 作为 MySQL 连接器包
      extra: {                          // 额外的数据库配置
        authPlugin: 'sha256_password',  // 指定认证插件为 sha256_password（MySQL 8.0+ 默认认证方式）
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
