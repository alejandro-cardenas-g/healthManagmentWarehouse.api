import { Company } from '../../company/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'permission_templates',
})
export class PermissionTemplate {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    name: 'name',
    nullable: false,
  })
  name: string;

  @Column('integer', {
    name: 'company_id',
    nullable: false,
  })
  companyId: number;

  @Column('character varying', {
    array: true,
    name: 'permissions',
    nullable: false,
    default: [],
  })
  permissions: string[];

  @ManyToOne(() => Company, (company) => company.permissionTemplates)
  @JoinColumn({ name: 'company_id', referencedColumnName: 'id' })
  company: Company;
}
