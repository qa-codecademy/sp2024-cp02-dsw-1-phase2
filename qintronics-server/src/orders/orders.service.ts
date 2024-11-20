import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SortingOrder } from 'src/common/enums/sorting.enum';
import { PageMetaDto } from 'src/common/pagination/page-meta.dto';
import { PageOptionsDto } from 'src/common/pagination/page-options.dto';
import { PageDto } from 'src/common/pagination/page.dto';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { EmailService } from 'src/email/email.service';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import {
  FindOptionsOrder,
  FindOptionsWhere,
  ILike,
  In,
  Repository,
} from 'typeorm';
import { OrderCreateDto, ProductsAndQuantity } from './dtos/order-create.dto';
import { QueryOrderReturnDto } from './dtos/order-query-return.dto';
import { OrderQueryDto } from './dtos/order-query.dto';
import { OrderReturnDto } from './dtos/order-return.dto';
import { OrderUpdateDto } from './dtos/order-update.dto';
import { StatusUpdateDto } from './dtos/status-update.dto';
import { OrderProduct } from './orders-products.entity';
import { MonthlyTotalsDto } from './dtos/order-totals-return.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(OrderProduct)
    private orderProductsRepository: Repository<OrderProduct>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  // * FIND USER BY ID
  async findUserById(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['userInfo'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // * ORDER CONFIRMATION MAILING FUNCTION
  async sendConfirmationEmail(
    orderDetails: Order,
    userId: string,
    productsAndQuantity: ProductsAndQuantity[],
  ): Promise<void> {
    const user = await this.findUserById(userId);
    const productDetails = [];
    for (const product of productsAndQuantity) {
      const productEntity = await this.productsRepository.findOne({
        where: { id: product.productId },
      });

      productDetails.push({
        productName: productEntity?.name,
        quantity: product.quantity,
      });
    }
    await this.emailService.sendOrderConfirmationEmail(
      orderDetails.email,
      orderDetails?.firstName,
      orderDetails,
      productDetails,
    );
  }

  // * CALCULATE TOTAL
  updateTotal(
    products: Product[],
    productsAndQuantity: ProductsAndQuantity[],
  ): number {
    return products.reduce((acc, product) => {
      const productQuantity =
        productsAndQuantity.find((pq) => pq.productId === product.id)
          ?.quantity || 1;
      if (product.discount > 0) {
        return Math.round(
          acc + product.price * (1 - product.discount / 100) * productQuantity,
        );
      } else {
        return acc + product.price * productQuantity;
      }
    }, 0);
  }

  // * GET TOTALS FOR ADMIN DASHBOARD
  async getMonthlyTotalsHistory(): Promise<MonthlyTotalsDto> {
    const orderTotals = await this.ordersRepository
      .createQueryBuilder('order')
      .select("TO_CHAR(order.created_at, 'YYYY-MM')", 'month')
      .addSelect('SUM(order.total)', 'totalSum')
      .addSelect('COUNT(order.id)', 'totalOrdersNumber')
      .addSelect('AVG(order.total)', 'averageOrderValue')
      .where("order.created_at >= DATE_TRUNC('year', now())")
      .andWhere('order.isCanceled = false')
      .groupBy("TO_CHAR(order.created_at, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    const userTotals = await this.usersRepository
      .createQueryBuilder('user')
      .select("TO_CHAR(user.created_at, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'newCustomers')
      .where('user.role = :role', { role: 'Customer' })
      .andWhere("user.created_at >= DATE_TRUNC('year', now())")
      .groupBy("TO_CHAR(user.created_at, 'YYYY-MM')")
      .orderBy('month', 'ASC')
      .getRawMany();

    return { orderTotals, userTotals };
  }

  // * ADD PRODUCT TO ORDER
  async addProductToOrder(
    orderId: string,
    productId: string,
    quantity: number,
    priceAtOrderTime: number,
  ): Promise<OrderProduct> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!product || product.availability < quantity) {
      throw new NotFoundException(
        'Product unavailable or does not have sufficient stock',
      );
    }
    product.availability -= quantity;
    await this.productsRepository.save(product);

    const orderProduct = this.orderProductsRepository.create({
      order,
      product,
      quantity,
      priceAtOrderTime,
    });
    return await this.orderProductsRepository.save(orderProduct);
  }

  //* GET ALL ORDERS W/ QUERIES AND PAGINATION
  async getAll(
    paginationQueries: PageOptionsDto,
    {
      sortTotal,
      userMail,
      isDelivered,
      isTaken,
      isCanceled,
      isPaid,
      orderNumber,
      sortDelDate,
    }: OrderQueryDto,
  ): Promise<PageDto<QueryOrderReturnDto>> {
    let whereQuery = {} satisfies FindOptionsWhere<Order>;
    let orderQuery = {} satisfies FindOptionsOrder<Order>;

    isDelivered ? (whereQuery = { ...whereQuery, isDelivered }) : {};
    isTaken ? (whereQuery = { ...whereQuery, isTaken }) : {};
    isCanceled ? (whereQuery = { ...whereQuery, isCanceled }) : {};
    isPaid ? (whereQuery = { ...whereQuery, isPaid }) : {};
    orderNumber ? (whereQuery = { ...whereQuery, orderNumber }) : {};
    userMail
      ? (whereQuery = {
          ...whereQuery,
          user: { email: ILike(`%${userMail}%`) },
        })
      : {};

    if (sortTotal) {
      sortTotal === SortingOrder.ASC
        ? (orderQuery = { ...orderQuery, total: 'ASC' })
        : (orderQuery = { ...orderQuery, total: 'DESC' });
    }

    if (sortDelDate) {
      sortDelDate === SortingOrder.ASC
        ? (orderQuery = { ...orderQuery, prefDeliveryDate: 'ASC' })
        : (orderQuery = { ...orderQuery, prefDeliveryDate: 'DESC' });
    }

    const [entities, itemCount] = await this.ordersRepository.findAndCount({
      where: whereQuery,
      order: orderQuery,
      relations: {
        orderProduct: {
          product: true,
        },
        user: true,
      },
      withDeleted: true,
      skip: paginationQueries.skip,
      take: paginationQueries.perPage,
    });

    const pageMetaDto = new PageMetaDto({ itemCount, paginationQueries });
    const transformedOrders = entities.map((order) => {
      const dto = plainToInstance(QueryOrderReturnDto, order, {
        excludeExtraneousValues: true,
      });

      dto.productsAndQuantity = order.orderProduct.map((op) => ({
        product: {
          id: op.product.id,
          name: op.product.name,
          brand: op.product.brand,
          img: op.product.img,
        },
        quantity: op.quantity,
        priceAtOrderTime: op.priceAtOrderTime,
      }));

      return dto;
    });
    const answer = new PageDto(transformedOrders, pageMetaDto);
    return answer;
  }

  // * GET ORDER BY ID
  async getOrderById(orderId: string): Promise<OrderReturnDto> {
    const orderByID = await this.ordersRepository.findOne({
      relations: {
        orderProduct: {
          product: true,
        },
        user: true,
      },
      where: { id: orderId },
    });

    if (!orderByID) throw new NotFoundException('Order not found');

    return plainToInstance(OrderReturnDto, orderByID, {
      excludeExtraneousValues: true,
    });
  }

  //* GET ORDERS BY USER ID
  async getOrdersByUserId(userId: string): Promise<OrderReturnDto[]> {
    const ordersOfUser = await this.ordersRepository.find({
      relations: {
        orderProduct: {
          product: true,
        },
      },
      where: {
        userId,
      },
    });
    if (!ordersOfUser || ordersOfUser.length < 1)
      throw new NotFoundException('No orders by this user');
    return plainToInstance(OrderReturnDto, ordersOfUser, {
      excludeExtraneousValues: true,
    });
  }

  //* CREATE ORDER
  async createOrder(
    body: OrderCreateDto,
    currentUser: ICurrentUser,
  ): Promise<OrderReturnDto> {
    const products = await this.productsRepository.findBy({
      id: In(body.productsAndQuantity.map((product) => product.productId)),
    });

    const productPriceMap = new Map<string, number>();
    products.forEach((product) => {
      if (product.discount > 0) {
        productPriceMap.set(
          product.id,
          Math.round(product.price * (1 - product.discount / 100)),
        );
      } else {
        productPriceMap.set(product.id, product.price);
      }
    });

    const total = this.updateTotal(products, body.productsAndQuantity);

    const order = {
      ...body,
      userId: currentUser?.userId,
      isTaken: false,
      isDelivered: false,
      isCanceled: false,
      total,
    };

    const newOrder = this.ordersRepository.create(order);
    const createdOrder = await this.ordersRepository.save(newOrder);

    for (const { productId, quantity } of body.productsAndQuantity) {
      const price = productPriceMap.get(productId);
      await this.addProductToOrder(createdOrder.id, productId, quantity, price);
    }

    await this.sendConfirmationEmail(
      createdOrder,
      currentUser?.userId,
      body.productsAndQuantity,
    );

    const completeOrder = await this.ordersRepository.findOne({
      where: { id: createdOrder.id },
      relations: {
        orderProduct: {
          product: true,
        },
        user: true,
      },
    });

    return plainToInstance(OrderReturnDto, completeOrder, {
      excludeExtraneousValues: true,
    });
  }

  // * CANCEL ORDER (USER)
  async cancelOrder(
    orderId: string,
    user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    const orderToBeCanceled = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: {
        orderProduct: {
          product: true,
        },
      },
    });

    if (!orderToBeCanceled) {
      throw new NotFoundException('No such order');
    }

    if (orderToBeCanceled.userId !== user?.userId && user?.role !== 'Admin') {
      throw new UnauthorizedException('Not authorized to cancel this order');
    }

    for (const orderProduct of orderToBeCanceled.orderProduct) {
      orderProduct.product.availability += orderProduct.quantity;
      await this.productsRepository.save(orderProduct.product);
    }

    const updatedOrder = this.ordersRepository.merge(orderToBeCanceled, {
      isCanceled: true,
      lastUpdatedBy: user?.email,
    });
    const wholeUser = await this.findUserById(user?.userId);
    await this.emailService.sendOrderCancelationEmail(
      orderToBeCanceled.email,
      wholeUser.userInfo?.firstName,
      updatedOrder,
    );
    const canceledOrder = await this.ordersRepository.save(updatedOrder);

    return plainToInstance(OrderReturnDto, canceledOrder, {
      excludeExtraneousValues: true,
    });
  }

  //* CHANGE ORDER STATUS (DELIVERY PERSON)
  async updateOrderStatus(
    status: StatusUpdateDto,
    orderId: string,
    user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    const orderToBeUpdated = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: {
        orderProduct: {
          product: true,
        },
      },
    });

    if (!orderToBeUpdated) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = this.ordersRepository.merge(orderToBeUpdated, status);
    updatedOrder.lastUpdatedBy = user?.email;

    return plainToInstance(
      OrderReturnDto,
      this.ordersRepository.save(updatedOrder),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  //* UPDATE ORDER (ADMIN)
  async updateOrder(
    updateBody: OrderUpdateDto,
    orderId: string,
    user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: {
        orderProduct: {
          product: true,
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    let updatedData = {
      ...order,
      ...updateBody,
    };

    const updatedOrder = this.ordersRepository.merge(order, updatedData);
    updatedOrder.lastUpdatedBy = user?.email;
    return plainToInstance(
      OrderReturnDto,
      this.ordersRepository.save(updatedOrder),
      {
        excludeExtraneousValues: true,
      },
    );
  }

  // * DELETE ORDER
  async deleteOrder(orderId: string): Promise<void> {
    const deleteAnswer = await this.ordersRepository.softDelete(orderId);
    if (deleteAnswer.affected < 1)
      throw new NotFoundException('No order with this Id');
  }
}
