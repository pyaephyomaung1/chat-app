import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messageService: MessagesService) {}
  @Get('')
  greet() {
    return this.messageService.greet();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Req() request: { user: { userId: string; email: string } },
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return await this.messageService.sendMessage(
      request.user.userId,
      sendMessageDto,
    );
  }

  @Get('/conversation/:userId')
  @UseGuards(JwtAuthGuard)
  async getConversation(
    @Req() request: { user: { userId: string; email: string } },
    @Param('userId') otherUserId: string,
  ) {
    return await this.messageService.getConversation(
      request.user.userId,
      otherUserId,
    );
  }
}
