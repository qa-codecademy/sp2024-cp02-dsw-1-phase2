import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/categories/category.entity';
import { Order } from 'src/orders/order.entity';
import { OrderProduct } from 'src/orders/orders-products.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    type: String,
    description: 'Product ID',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  id: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Product name',
    example: 'Lenovo ThinkPad X1 Carbon Gen 9',
  })
  name: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Product brand',
    example: 'Lenovo',
  })
  brand: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Product description',
    example: 'Ultra-lightweight business laptop with powerful performance.',
  })
  description: string;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Product image',
    example: './images/laptops/lenovo-1.jpg',
  })
  img: string;

  @Column('jsonb')
  @ApiProperty({
    type: Object,
    description: 'Product specifications',
    example: {
      cpu: 'Intel Core i7-1165G7',
      gpu: 'Intel Iris Xe',
      ram: '16GB',
      storage: '512GB SSD',
      display: '14" FHD',
      camera: '720p HD',
      battery: 'Up to 15 hours',
      os: 'Windows 10 Pro',
    },
  })
  specifications: Record<string, any>;

  @Column()
  @ApiProperty({
    type: Number,
    description: 'Product price',
    example: 1499,
  })
  price: number;

  @Column()
  @ApiProperty({
    type: String,
    description: 'Product warranty',
    example: '3 years',
  })
  warranty: string;

  @Column()
  @ApiProperty({
    type: Number,
    description: 'Product availability',
    example: 20,
  })
  availability: number;

  @Column()
  @ApiProperty({
    type: Number,
    description: 'Product discount',
    example: 10,
  })
  discount: number;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({
    name: 'category_id',
  })
  category: Category;

  @Column({
    name: 'category_id',
  })
  @ApiProperty({
    type: String,
    description: 'The ID of the products category',
    example: '0ff3e9c2-ec93-4735-a1da-50c834a78ffc',
  })
  categoryId: string;

  @ManyToMany(() => User, (user) => user.favoriteProducts)
  @JoinTable({
    name: 'favorite_products',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  favoritedBy: User[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.product)
  orderProduct: OrderProduct[];

  @CreateDateColumn()
  @ApiProperty({
    type: String,
    description: 'Product created date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({
    type: String,
    description: 'Product updated date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

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
