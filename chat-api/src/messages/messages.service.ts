import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SendMessageDto } from './dto/send-message.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly userService: UsersService,
  ) {}

  greet() {
    return 'Hello From Message';
  }

  async sendMessage(senderId: string, sendMessageDto: SendMessageDto) {
    const sender = await this.userService.findOne(senderId);
    const receiver = await this.userService.findOne(sendMessageDto.receiverId);
    if (!receiver) {
      throw new NotFoundException('Receiver not found');
    }
    const message = this.messagesRepository.create({
      content: sendMessageDto.content,
      sender,
      receiver,
    });

    return await this.messagesRepository.save(message);
  }

  async getConversation(currentUserId: string, otherUserId: string) {
    return await this.messagesRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.receiver', 'receiver')
      .where('(sender.id = :currentUserId AND receiver.id = :otherUserId)', {
        currentUserId,
        otherUserId,
      })
      .orWhere('(sender.id = :otherUserId AND receiver.id = :currentUserId)', {
        currentUserId,
        otherUserId,
      })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }
}
