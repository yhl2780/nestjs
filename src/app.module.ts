import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ExampleModule } from './example/example.module';
import { ConfigModule } from '@nestjs/config';
import { JwtMiddleware } from './common/middleware/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'prod'
          ? '.env.production'
          : process.env.NODE_ENV === 'dev'
          ? '.env.development'
          : '.env.local',
    }),
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(JwtMiddleware)
      .exclude('manager/login', 'manager/logout', 'jwt/(.*)', 'health', {
        path: 's3',
        method: RequestMethod.GET,
      })
      .forRoutes('*');
  }
}
