import { Controller, Get, Query } from '@nestjs/common';
import { User } from '../../auth/entities';
import { SearchBuilder } from '../../common/classes/searchBuilder.v2.class';
import { userSearchTermsFields } from '../schemas/search/user-search.schema';
import { UsersSearchService } from '../services/user-search.service';
import { UsersSearchValidator } from '../validators/users-search.validator';
import { AuthWithPermissions } from '../../auth/decorators/authWithPermissions.decorator';
import { EAllowedPermissions } from '../../auth/constants';
import { GetUser } from '../../auth/decorators';
import { IAuthUser } from '../../auth/interfaces';

@Controller('users-search')
export class UsersSearchController {
  constructor(private readonly userSearchsService: UsersSearchService) {}

  @AuthWithPermissions({
    strategy: 'matchAll',
    permissions: [EAllowedPermissions.ListUsers],
  })
  @Get()
  async search(
    @Query() params: UsersSearchValidator,
    @GetUser() user: IAuthUser,
  ) {
    const { order, page, filters = [], query = [] } = params;
    const bruteFilters = await this.userSearchsService.getFiltersConversion(
      false,
      filters,
    );
    const newFilters = this.userSearchsService.getFilters(bruteFilters);
    const legacyFilters = this.userSearchsService.getLegacyFilters(
      user.companyId,
      user.id,
    );
    const allFilters = [...newFilters, ...legacyFilters];
    const terms = this.userSearchsService.getTerms(
      query,
      userSearchTermsFields,
    );
    const searchBuilder = this.userSearchsService.getSelectSearchBuilder();
    const search = new SearchBuilder<User>(searchBuilder);

    search.addEqualFilters(allFilters);
    search.addMatchFilters(terms);
    search.addFields([
      'u.id',
      'u.email',
      'u.firstName',
      'u.lastName',
      'u.isActive',
    ]);
    search.addOrder(order);
    search.addPagination(page, 20);
    const users = await search.search();
    return this.adapter(users);
  }

  @AuthWithPermissions({
    strategy: 'matchAll',
    permissions: [EAllowedPermissions.ListUsers],
  })
  @Get('/counter')
  async getUsersCounter(
    @Query() params: UsersSearchValidator,
    @GetUser() user: IAuthUser,
  ) {
    const { filters = [], query = [] } = params;
    const bruteFilters = await this.userSearchsService.getFiltersConversion(
      false,
      filters,
    );
    const newFilters = this.userSearchsService.getFilters(bruteFilters);
    const legacyFilters = this.userSearchsService.getLegacyFilters(
      user.companyId,
      user.id,
    );
    const allFilters = [...newFilters, ...legacyFilters];
    const terms = this.userSearchsService.getTerms(
      query,
      userSearchTermsFields,
    );
    const searchBuilder = this.userSearchsService.getSelectSearchBuilder();
    const search = new SearchBuilder<User>(searchBuilder);

    search.addEqualFilters(allFilters);
    search.addMatchFilters(terms);
    search.addFields(['u.id']);
    const counterUsers = await search.count();
    return { counter: counterUsers };
  }

  private adapter(users: User[]) {
    return users.map((user) => ({
      fullName: `${user.firstName} ${user.lastName}`,
      isActive: user.isActive,
      email: user.email,
      tags: user.tags,
      id: user.id,
    }));
  }
}
