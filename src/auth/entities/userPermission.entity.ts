import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity({ name: 'user_permissions' })
@Index('index_permission_id_on_user_permission')
@Index('index_user_id_on_user_permission')
export class UserPermission {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('integer', {
    name: 'permission_id',
    nullable: false,
  })
  permissionId: number;

  @Column('uuid', {
    name: 'user_id',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.userPermissions)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Permission, (permission) => permission.userPermissions)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission: Permission;
}
