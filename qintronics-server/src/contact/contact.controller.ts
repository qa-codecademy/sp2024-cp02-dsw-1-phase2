import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { Body, Controller, Post } from '@nestjs/common';
import { ContactCreateDto } from './dtos/contact-create.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Send contact email.' })
  @ApiOkResponse({ description: 'Contact email sent successfully.' })
  @ApiBody({ type: ContactCreateDto })
  contact(@Body() body: ContactCreateDto) {
    return this.contactService.contact(body);
  }
}
