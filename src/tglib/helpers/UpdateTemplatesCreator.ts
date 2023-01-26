import { readFileSync, writeFileSync } from 'fs';
import { type SCOPE_UPDATE_TYPES } from '../tgTypes/botUpdatesTypes';
import { type Context } from 'telegraf';
import { type Update } from 'typegram';
import path from 'path';
export default class UpdateTemplatesCreator {
  static readonly private_templates_path = path.join(__dirname, '../../../test/privateUpdates/templates/');
  static createTemplate(updateName: SCOPE_UPDATE_TYPES, context: Context<Update>): void {
    const template: string = JSON.stringify(context);

    writeFileSync(`${UpdateTemplatesCreator.private_templates_path}${updateName}.json`, template);
  }

  static getTemplate(updateName: SCOPE_UPDATE_TYPES) {
    const file = readFileSync(`${UpdateTemplatesCreator.private_templates_path}${updateName}.json`, 'utf-8');
    const parsedFile = JSON.parse(file);

    return parsedFile;
  }
}
