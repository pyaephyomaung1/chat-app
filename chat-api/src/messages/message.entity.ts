import { nanoid } from 'nanoid';
import { User } from 'src/users/user.entity';
import { BeforeInsert, Column, ManyToOne, PrimaryColumn } from 'typeorm';

export class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => User)
  receiver: User;

  @Column()
  createdAt: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = nanoid(12);
    }
    this.createdAt = new Date();
  }
}
