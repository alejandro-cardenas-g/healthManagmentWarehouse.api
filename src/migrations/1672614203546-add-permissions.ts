import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPermissions1672614203546 implements MigrationInterface {
  private permissions = [
    { name: 'user-read-list', module: 0 },
    { name: 'user-read-single', module: 0 },
    { name: 'user-create', module: 0 },
    { name: 'user-delete', module: 0 },
    { name: 'user-edit-basic', module: 0 },
    { name: 'user-edit-permissions', module: 0 },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "public"."permissions"("name", "module")  VALUES ${this.readPermissions()} ON CONFLICT ("name") DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return;
  }

  private readPermissions() {
    let queryValues = '';
    this.permissions.forEach((value, index) => {
      let newValue = `('${value.name}', ${value.module})`;
      if (index + 1 !== this.permissions.length) {
        newValue = `${newValue},`;
      }
      queryValues += newValue;
    });
    return queryValues;
  }
}
