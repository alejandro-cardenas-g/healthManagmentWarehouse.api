import { MigrationInterface, QueryRunner } from 'typeorm';

export class Permissions1672508084291 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "public"."permissions" (
            id serial4 NOT NULL,
            name varchar NOT NULL,
            "module" int4 NOT NULL DEFAULT 0,
            CONSTRAINT "PK_permission_id" PRIMARY KEY (id),
            CONSTRAINT "UQ_name" UNIQUE (name)
        );
    `);
    await queryRunner.query(`
        CREATE INDEX IF NOT EXISTS "index_permission_name" ON "public"."permissions" USING btree (name);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "index_permission_name";
    `);
    await queryRunner.query(
      `ALTER TABLE "public"."permissions" DROP CONSTRAINT "UQ_name";`,
    );
    await queryRunner.query(`DROP TABLE "public"."permissions";`);
  }
}
