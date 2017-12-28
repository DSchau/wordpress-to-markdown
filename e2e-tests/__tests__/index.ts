import * as fs from 'mz/fs';
import * as path from 'path';

import { parse, write } from '../../src';

let xml;
beforeAll(async () => {
  xml = await fs.readFile(path.resolve('input/export.xml'), 'utf8');
});

test('it can parse into JSON', async () => {
  const json = await parse(xml);
});

test('it can write authors', async () => {
  jest.setTimeout(20000);
  await write(xml);
});
