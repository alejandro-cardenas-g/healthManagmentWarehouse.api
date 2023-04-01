import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1672507661971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "public"."users" (
                id uuid NOT NULL DEFAULT uuid_generate_v4(),
                first_name varchar NOT NULL,
                last_name varchar NOT NULL,
                email varchar NOT NULL,
                "password" varchar NOT NULL,
                is_root_user bool NOT NULL DEFAULT false,
                tags _varchar NOT NULL DEFAULT '{}'::character varying[],
                is_active bool NOT NULL DEFAULT true,
                profile_picture varchar NULL,
                company_id int4 NOT NULL,
                token_version int4 NOT NULL DEFAULT 0,
                created_at timestamp NOT NULL DEFAULT now(),
                updated_at timestamp NOT NULL DEFAULT now(),
                CONSTRAINT "PK_user_id" PRIMARY KEY (id),
                CONSTRAINT "UQ_email" UNIQUE (email),
                CONSTRAINT "FK_company_id" FOREIGN KEY (company_id) REFERENCES "public"."companies"(id)
            );
        `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "index_users_email" ON "public"."users" USING btree(email);
      CREATE INDEX IF NOT EXISTS "index_users_search_full_name" ON "public"."users" USING btree((first_name || ' ' || last_name))
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "index_users_email",
      DROP INDEX "index_users_search_full_name",
    `);
    await queryRunner.query(
      `ALTER TABLE "public"."users" DROP CONSTRAINT "UQ_email"`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."users" DROP CONSTRAINT "FK_company_id"`,
    );
    await queryRunner.query(`DROP TABLE "public"."users"`);
  }
}
