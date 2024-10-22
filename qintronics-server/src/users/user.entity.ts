import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enums/roles.enum';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';
import { UserInfo } from 'src/user-info/user-info.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RefreshToken } from '../refresh-tokens/refresh-token.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: String,
    description: `User's ID`,
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @Column({ unique: true })
  @ApiProperty({
    type: String,
    description: `User's email`,
    example: 'marija@gmail.com',
  })
  email: string;

  @Column()
  @ApiProperty({
    type: String,
    description: `User's password`,
    example: 'Pass111!',
  })
  password: string;

  @Column({
    enum: Role,
    enumName: 'role',
    default: Role.Customer,
  })
  @ApiProperty({
    enum: Role,
    description: `User's role`,
    example: Role.Customer,
    default: Role.Customer,
  })
  role: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  @ApiProperty({
    type: [RefreshToken],
    description: `User's refresh tokens`,
    example: [
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJ1c2VySWQiOiI0ZjcxMjhmYi05MGUxLTQ5MzUtOTkzYy00ZGI3YmJhYTQ0ZjYiLCJlbWFpbCI6ImN1c3RvbWVyQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwiaWF0IjoxNzI3NzI0OTgxLCJleHAiOjE3Mjc4MTEzODEsImlzcyI6IlFpbnRyb25pY3MifQ.GSwJ-dVxSG7LEcTkLGEFQ8BX9RT5MihZnX_pRurSyG8',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxYjdmZTI2NC04MjliLTQ5YTYtOTk2OS0xNTRmYjFmMTUyMzciLCJlbWFpbCI6ImN1c3RvbWVyQGV4YW1wbGUuY29tIiwicm9sZSI6IkN1c3RvbWVyIiwicmVmcmVzaFRva2VucyI6W10sImlhdCI6MTcyNzUzMzAxMCwiZXhwIjoxNzI4MTM3ODEwLCJpc3MiOiJRaW50cm9uaWNzIn0.i0AdtjMZS_58gsRL6ybELVNykqWmxTfqKG-onJJN-34',
    ],
  })
  refreshTokens: RefreshToken[];
  // Refresh tokens are an array in case the user logs in from multiple devices, i.e. multiple refresh tokens are saved

  @OneToOne(() => UserInfo, { cascade: true })
  @JoinColumn({ name: 'user_info_id' })
  userInfo: UserInfo;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @ManyToMany(() => Product, (product) => product.favoritedBy)
  favoriteProducts: Product[];

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    type: Date,
    description: 'The time and date the user is created at',
    example: '2024-05-01 00:00:00',
  })
  createdAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  @ApiProperty({
    type: Date,
    description: 'The time and date the user is deleted at',
    example: '2024-05-01 00:00:00',
  })
  deletedAt: Date;
}