import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ProductsAndQuantity } from 'src/orders/dtos/order-create.dto';
import { Order } from 'src/orders/order.entity';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendResetPasswordEmail(email: string, name: string, token: string) {
    const subject = 'Reset your password';

    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './reset-password-email',
      context: { name, token },
    });
  }

  async sendOrderConfirmationEmail(
    email: string,
    name: string,
    orderDetails: Order,
    items: ProductsAndQuantity[],
  ) {
    const subject = `Order #${orderDetails.orderNumber} placement confirmation`;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './order-confirmation-email',
      context: { name, orderDetails, items },
    });
  }

  async sendOrderCancelationEmail(
    email: string,
    name: string,
    orderDetails: Order,
  ) {
    const subject = `Order #${orderDetails.orderNumber} cancelation confirmation`;
    const contextObj = { name, orderDetails };
    await this.mailerService.sendMail({
      to: email,
      subject,
      template: './order-cancelation-email',
      context: contextObj,
    });
  }

  async sendContactEmail(
    name: string,
    email: string,
    phone: string,
    message: string,
  ) {
    await this.mailerService.sendMail({
      subject: `New Message from: ${name}`,
      to: process.env.EMAIL_USER,
      template: './contact-email',
      context: { name, phone, message, email },
    });
  }

  async sendNewsletterSubscribeEmail(email: string) {
    await this.mailerService.sendMail({
      subject: 'Welcome to the Qintronics Newsletter!',
      to: email,
      template: './newsletter-subscribe-email',
      context: {},
    });
  }
}
