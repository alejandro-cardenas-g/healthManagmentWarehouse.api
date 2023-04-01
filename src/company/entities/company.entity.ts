import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionTemplate, User } from '../../auth/entities';

@Entity({
  name: 'companies',
})
export class Company {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column('character varying', {
    name: 'slug',
    nullable: false,
    unique: true,
  })
  slug: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(
    () => PermissionTemplate,
    (permissionTemplate) => permissionTemplate.company,
  )
  permissionTemplates: PermissionTemplate[];
}
