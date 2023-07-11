import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Chat } from './chat.entity';
import { Order } from './order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Room extends CoreEntity {
  @OneToMany((type) => Chat, (chat: Chat) => chat.room, {
    nullable: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  chatList?: Chat[];

  @ManyToMany((type) => User, (user: User) => user.roomList)
  @JoinTable()
  userList: User[];

  @ManyToOne((type) => Order, (order: Order) => order.roomList, {
    onDelete: 'CASCADE',
  })
  order: Order;
}
