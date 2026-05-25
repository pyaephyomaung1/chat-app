import { Controller, Get } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}
  @Get('')
  greet() {
    return this.messageService.greet();
  }
}
