import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPermissions1672508742137 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "public"."user_permissions" (
            id serial4 NOT NULL,
            permission_id int4 NOT NULL,
            user_id uuid NOT NULL,
            CONSTRAINT "PK_user_permission_id" PRIMARY KEY (id),
            CONSTRAINT "FK_user_id" FOREIGN KEY (user_id) REFERENCES "public"."users"(id),
            CONSTRAINT "FK_permission_id" FOREIGN KEY (permission_id) REFERENCES "public"."permissions"(id)
        );
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "index_permission_id_on_user_permission" ON "public"."user_permissions" USING btree (permission_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "index_user_id_on_user_permission" ON "public"."user_permissions" USING btree (user_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "index_permission_id_on_user_permission";
    `);
    await queryRunner.query(`
        DROP INDEX "index_user_id_on_user_permission";
    `);
    await queryRunner.query(
      `ALTER TABLE "public"."user_permissions" DROP CONSTRAINT "FK_permission_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_permissions" DROP CONSTRAINT "FK_user_id";`,
    );
    await queryRunner.query(`DROP TABLE "public"."user_permissions";`);
  }
}
