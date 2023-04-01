import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { UserPermission } from './userPermission.entity';

@Entity({
  name: 'permissions',
})
@Index('index_permission_name')
export class Permission {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('character varying', {
    name: 'name',
    unique: true,
    nullable: false,
  })
  name: string;

  @Column('int4', {
    name: 'module',
    nullable: false,
    default: 0,
  })
  module: number;

  @OneToMany(
    () => UserPermission,
    (userPermission) => userPermission.permission,
  )
  userPermissions: UserPermission[];
}
