import { MigrationInterface, QueryRunner } from 'typeorm';

export class PermissionTemplate1672509164253 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "public"."permission_templates" (
            id serial4 NOT NULL,
            "name" varchar NOT NULL,
            company_id int4 NOT NULL,
            permissions _varchar NOT NULL DEFAULT '{}'::character varying[],
            CONSTRAINT "PK_permission_template_id" PRIMARY KEY (id),
            CONSTRAINT "FK_company_id" FOREIGN KEY (company_id) REFERENCES "public"."companies"(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."permission_templates" DROP CONSTRAINT "FK_company_id";`,
    );
    await queryRunner.query(`DROP TABLE "public"."permission_templates";`);
  }
}
