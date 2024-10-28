import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderProduct } from './orders-products.entity';

@Entity()
export class Order {
  // * UUID
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: String,
    description: 'Order ID',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  // * ORDER NUMBER
  @Column({
    name: 'order_number',
  })
  @Generated('increment')
  @ApiProperty({
    type: Number,
    description: 'Simple numeric order numbering, auto-generated',
    example: 202,
  })
  orderNumber: number;

  // * ORDER PROCESSING STATUS
  @Column({
    name: 'is_taken',
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    description:
      'Order Processing Status, true if order is processed and taken by the delivery service',
    example: true,
  })
  isTaken: boolean;

  // * ORDER CANCELING STATUS
  @Column({
    name: 'is_canceled',
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    description:
      'Order Canceling Status, true if order is canceled, can be canceled by the user or the admin',
    example: true,
  })
  isCanceled: boolean;

  // * ORDER DELIVERY STATUS
  @Column({
    name: 'is_delivered',
    default: false,
  })
  @ApiProperty({
    type: Boolean,
    description:
      'Order Delivery Status, true if the order is delivered, the order is then completed. Set by the delivery person',
    example: true,
  })
  isDelivered: boolean;

  // * ORDER PAYMENT STATUS
  @Column({
    name: 'is_paid',
  })
  @ApiProperty({
    type: Boolean,
    description:
      'Order Payment Status, true if the order is paid online, false if cash on delivery',
    example: true,
  })
  isPaid: boolean;

  // * ORDER EMAIL
  @Column()
  @ApiProperty({
    type: String,
    description: 'Email of the recipient',
    example: 'john.doe@gmail.com',
  })
  email: string;

  // * ORDER FIRST NAME
  @Column({
    name: 'first_name',
  })
  @ApiProperty({
    type: String,
    description: 'First name of the recipient',
    example: 'John',
  })
  firstName: string;

  // * ORDER LAST NAME
  @Column({
    name: 'last_name',
  })
  @ApiProperty({
    type: String,
    description: 'Last name of the recipient',
    example: 'Doe',
  })
  lastName: string;

  // * ORDER PHONE NUMBER
  @Column()
  @ApiProperty({
    type: String,
    description: 'Phone number of the recipient',
    example: '+38977777777',
  })
  phoneNumber: string;

  // * ORDER ADDRESS
  @Column()
  @ApiProperty({
    type: String,
    description: 'Street address and home number of the order',
    example: 'Partizanska 1',
  })
  address: string;

  // * ORDER ZIP CODE
  @Column()
  @ApiProperty({
    type: Number,
    description: 'Order address zip code',
    example: 1000,
  })
  zip: number;

  // * ORDER ADDRESS
  @Column({
    nullable: true,
  })
  @ApiProperty({
    type: String,
    description: 'Order address city',
    example: 'Skopje',
  })
  city: string;

  // * PREFERRED DELIVERY DATE
  @Column({
    type: 'date',
    name: 'delivery_date',
  })
  @ApiProperty({
    type: Date,
    description: 'Preferred date of delivery',
    example: '2024-11-21',
  })
  prefDeliveryDate: Date;

  // * TOTAL PRICE
  @Column({
    type: 'double precision',
  })
  @ApiProperty({
    type: Number,
    description:
      'Total price of the order calculated based on the individual product prices and quantities',
    example: 2000,
  })
  total: number;

  // * USER RELATION
  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({
    name: 'user_id',
  })
  @ApiProperty({
    description: 'User that made the order',
    type: () => User,
  })
  user: User;

  // * USER ID
  @Column({
    name: 'user_id',
  })
  @ApiProperty({
    type: String,
    description: 'The ID of the user that made the order',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  userId: string;

  // * PRODUCT RELATION
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  orderProduct: OrderProduct[];

  // * Created At
  @CreateDateColumn({
    name: 'created_at',
  })
  @ApiProperty({
    type: Date,
    example: '2024-04-21 11:13:15.61689',
  })
  createdAt: Date;

  // * Updated At
  @UpdateDateColumn({
    name: 'updated_at',
  })
  @ApiProperty({
    type: Date,
    example: '2024-04-21 11:13:15.61689',
  })
  updatedAt: Date;

  // * Updated By
  @Column({
    name: 'last_updated_by',
    nullable: true,
  })
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'user@mail.com',
  })
  lastUpdatedBy: string;

  // * Deleted At
  @DeleteDateColumn({
    name: 'deleted_at',
  })
  @ApiProperty({
    type: Date,
    example: '2024-04-21 11:13:15.61689',
    nullable: true,
  })
  deletedAt: Date;
}
