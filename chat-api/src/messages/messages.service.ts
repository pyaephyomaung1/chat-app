import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Message } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  greet() {
    return 'Hello From Message';
  }
}
