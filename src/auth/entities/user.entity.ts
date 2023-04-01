import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserPermission } from './userPermission.entity';
import { Company } from '../../company/entities';

@Entity({
  name: 'users',
})
@Index('index_users_search_full_name', { synchronize: false })
@Index('index_users_email', { synchronize: false })
export class User {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column('character varying', {
    name: 'first_name',
    nullable: false,
  })
  firstName: string;

  @Column('character varying', {
    name: 'last_name',
    nullable: false,
  })
  lastName: string;

  @Column('character varying', {
    unique: true,
    name: 'email',
    nullable: false,
  })
  email: string;

  @Column('character varying', {
    name: 'password',
    nullable: false,
  })
  password: string;

  @Column('boolean', {
    name: 'is_root_user',
    nullable: false,
    default: false,
  })
  isRootUser: boolean;

  @Column('character varying', {
    name: 'tags',
    nullable: false,
    default: [],
    array: true,
  })
  tags: string[];

  @Column('boolean', {
    name: 'is_active',
    nullable: false,
    default: true,
  })
  isActive: boolean;

  @Column('character varying', {
    name: 'profile_picture',
    nullable: true,
  })
  profilePicture: string | null;

  @Column('integer', {
    name: 'company_id',
    nullable: false,
  })
  companyId: number;

  @Column('int4', {
    name: 'token_version',
    default: 0,
    nullable: false,
  })
  tokenVersion: number;

  @CreateDateColumn({
    name: 'created_at',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: false,
  })
  updatedAt: Date;

  @OneToMany(() => UserPermission, (userPermission) => userPermission.user)
  userPermissions: UserPermission[];

  @ManyToOne(() => Company, (company) => company.users)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
