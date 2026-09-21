// migrations/XXX_add_tags_field_to_entry.ts

import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsFieldToEntry1672503600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "entry" ADD COLUMN "tags" text[] DEFAULT '{}'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "entry" DROP COLUMN "tags"`);
  }
}