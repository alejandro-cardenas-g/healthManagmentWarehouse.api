import { MigrationInterface, QueryRunner } from 'typeorm';

export class Companies1672500498634 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "public"."companies" (
        id serial4 NOT NULL,
        "name" varchar NOT NULL,
        slug varchar NOT NULL,
        CONSTRAINT "PK_company_id" PRIMARY KEY (id),
        CONSTRAINT "UQ_slug" UNIQUE (slug)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."companies" DROP CONSTRAINT "UQ_slug"`,
    );
    await queryRunner.query(`DROP TABLE "public"."companies"`);
  }
}
