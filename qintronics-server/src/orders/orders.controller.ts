import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/roles.enum';
import { JwtGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PageDto } from 'src/common/pagination/page.dto';
import { ICurrentUser } from 'src/common/types/current-user.interface';
import { OrderCreateDto } from './dtos/order-create.dto';
import {
  QueryOrderReturnDto,
  SwaggerOrderReturnDto,
} from './dtos/order-query-return.dto';
import { OrderReturnDto } from './dtos/order-return.dto';
import { MonthlyTotalsDto } from './dtos/order-totals-return.dto';
import { OrderUpdateDto } from './dtos/order-update.dto';
import { GetAllOrdersDto } from './dtos/orders-get-all.dto';
import { StatusUpdateDto } from './dtos/status-update.dto';
import { OrdersService } from './orders.service';

@UseGuards(JwtGuard, RolesGuard)
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  //* GET TOTALS FOR ADMIN DASHBOARD
  @Roles(Role.Admin)
  @Get('/monthly-totals')
  @ApiOperation({ summary: 'Get monthly totals for admin dashboard' })
  @ApiOkResponse({
    type: [MonthlyTotalsDto],
    description: 'Monthly totals successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'This is admin only page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  async getMonthlyHistory(): Promise<MonthlyTotalsDto> {
    return await this.ordersService.getMonthlyTotalsHistory();
  }

  //* GET ALL ORDERS W/ QUERIES AND PAGINATION
  @Roles(Role.Admin, Role.DeliveryPerson, Role.Customer)
  @Post('/get')
  @ApiOperation({ summary: 'Retrieve all orders' })
  @ApiOkResponse({
    type: SwaggerOrderReturnDto,
    description: 'Orders successfully retrieved',
  })
  @ApiBody({
    type: GetAllOrdersDto,
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  getAll(@Body() body: GetAllOrdersDto): Promise<PageDto<QueryOrderReturnDto>> {
    const { paginationQueries, queryParams } = body;
    return this.ordersService.getAll(paginationQueries, queryParams);
  }

  //* GET ORDER BY ID
  @Roles(Role.Admin, Role.DeliveryPerson, Role.Customer)
  @Get('/single/:orderId')
  @ApiOperation({ summary: 'Retrieve order by ID' })
  @ApiParam({
    type: String,
    name: 'orderId',
    description: 'Id of the order',
  })
  @ApiOkResponse({
    type: OrderReturnDto,
    description: 'Order successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  getOrderById(
    @Param('orderId', ParseUUIDPipe) orderId: string,
  ): Promise<OrderReturnDto> {
    return this.ordersService.getOrderById(orderId);
  }

  //* GET ORDER BY USER ID
  @Roles(Role.Admin, Role.Customer)
  @Get('/:userId')
  @ApiOperation({
    summary: 'Retrieve all orders made by a user by providing users ID',
  })
  @ApiParam({
    type: String,
    name: 'userId',
    description: 'Id of the user',
  })
  @ApiOkResponse({
    type: [OrderReturnDto],
    description: 'Orders successfully retrieved',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  getOrdersByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<OrderReturnDto[]> {
    return this.ordersService.getOrdersByUserId(userId);
  }

  //* CREATE ORDER
  @Roles(Role.Admin, Role.Customer)
  @Post('/')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    type: OrderCreateDto,
  })
  @ApiCreatedResponse({
    type: OrderReturnDto,
    description: 'Order successfully created',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  createOrder(
    @Body() order: OrderCreateDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<OrderReturnDto> {
    return this.ordersService.createOrder(order, currentUser);
  }

  //* CANCEL ORDER (USER, ADMIN)
  @Roles(Role.Admin, Role.Customer)
  @Put('/cancel/:orderId')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({
    type: String,
    name: 'orderId',
    description: 'Id of the order',
  })
  @ApiOkResponse({
    type: OrderReturnDto,
    description: 'Order successfully canceled',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  cancelOrder(
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser() user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    return this.ordersService.cancelOrder(orderId, user);
  }

  //* CHANGE ORDER STATUS (DELIVERY PERSON)
  @Roles(Role.Admin, Role.DeliveryPerson)
  @Put('/status/:orderId')
  @ApiOperation({ summary: 'Change order status' })
  @ApiBody({
    type: StatusUpdateDto,
  })
  @ApiParam({
    type: String,
    name: 'orderId',
    description: 'Id of the order',
  })
  @ApiOkResponse({
    type: OrderReturnDto,
    description: 'Order status successfully updated',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  updateOrderStatus(
    @Body() status: StatusUpdateDto,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser() user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    return this.ordersService.updateOrderStatus(status, orderId, user);
  }
  //* UPDATE ORDER (ADMIN)
  @Roles(Role.Admin)
  @Put('/update/:orderId')
  @ApiOperation({ summary: 'Make changes to the order' })
  @ApiBody({
    type: OrderUpdateDto,
  })
  @ApiParam({
    type: String,
    name: 'orderId',
    description: 'Id of the order',
  })
  @ApiOkResponse({
    type: OrderReturnDto,
    description: 'Order successfully updated',
  })
  @ApiUnauthorizedResponse({
    description: 'User needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  updateOrder(
    @Body() order: OrderUpdateDto,
    @Param('orderId', ParseUUIDPipe) orderId: string,
    @CurrentUser() user: ICurrentUser | undefined,
  ): Promise<OrderReturnDto> {
    return this.ordersService.updateOrder(order, orderId, user);
  }

  //* DELETE ORDER (ADMIN)
  @Roles(Role.Admin)
  @Delete('/delete/:orderId')
  @ApiOperation({ summary: 'Delete an order by its ID' })
  @ApiParam({
    type: String,
    name: 'orderId',
    description: 'Id of the order',
  })
  @ApiResponse({
    status: 204,
    description: 'Order successfully deleted',
  })
  @ApiUnauthorizedResponse({
    description: 'Admin needs to be logged in to access this page.',
  })
  @ApiForbiddenResponse({
    description: 'User does not have permission to access this page.',
  })
  deleteOrder(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<void> {
    return this.ordersService.deleteOrder(orderId);
  }
}
