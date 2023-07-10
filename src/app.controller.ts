import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

import { AppService } from './app.service';
import { ContactDto } from './dtos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('identify')
  async identify(@Body(new ValidationPipe()) ccontactDto: ContactDto){
    const contact = await this.appService.identifyContact(ccontactDto);
    return contact;
  }
}
