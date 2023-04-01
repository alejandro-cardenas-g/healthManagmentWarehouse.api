import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { hashSync } from 'bcrypt';
import { FindOptionsSelect } from 'typeorm';
import { pick } from 'lodash';
import { CreateUserDto } from '../dto';
import { User } from '../entities';
import { UserRepository } from '../repositories';
import { PermissionService } from './permission.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly permissionService: PermissionService,
  ) {}

  async create(createUserDto: CreateUserDto, creator: User) {
    const {
      email,
      password,
      permissions = [],
      templatePermissionId,
      ...restUser
    } = createUserDto;
    const encryptedPassword = hashSync(password, 10);
    let user = await this.userRepository.findOne({
      where: { email },
      select: { companyId: true, id: true },
    });
    if (user) {
      const errorMessage =
        user.companyId !== creator.companyId
          ? 'Un usuario con este email pertenece a otra compañía'
          : 'Un usuario con este email ya existe';
      throw new ConflictException(errorMessage);
    }
    const userToCreate = this.userRepository.create({
      ...restUser,
      email,
      password: encryptedPassword,
      companyId: creator.companyId,
    });
    user = await this.userRepository.save(userToCreate);

    await this.permissionService.applyPemissionsStrategy(permissions, user.id, {
      templateId: templatePermissionId,
      companyId: creator.companyId,
    });

    return pick(user, [
      'id',
      'email',
      'firstName',
      'lastName',
      'isActive',
      'companyId',
    ]);
  }

  async getUser(
    userId: string,
    companyId: number,
    fields: FindOptionsSelect<User> = { id: true },
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
        companyId,
      },
      select: fields,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updatePermissions() {
    return await this.permissionService.applyPermissions(
      ['user-r-list', 'user-d', 'user-c'],
      'adbe2eba-2fe1-440d-ba28-bc4c94a3a8f6',
    );
  }

  async getAuthUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: {
        companyId: true,
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profilePicture: true,
        isRootUser: true,
      },
    });
    const userPermissions = await this.permissionService.getUserPermissions(
      userId,
    );
    return {
      user,
      userPermissions,
    };
  }
}
