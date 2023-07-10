import { CoreEntity } from 'src/common/entities/core.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
class Like extends CoreEntity {
  @ManyToOne((type) => Order, (order: Order) => order.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne((type) => User, (user: User) => user.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}

export default Like;
