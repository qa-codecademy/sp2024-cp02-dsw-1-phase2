import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { UserInfoModule } from './user-info/user-info.module';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes the config module accessible through the whole app
    }),
    DatabaseModule,
    ProductsModule,
    OrdersModule,
    AuthModule,
    CategoriesModule,
    UsersModule,
    UserInfoModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
