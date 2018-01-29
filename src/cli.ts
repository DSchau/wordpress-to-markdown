#!/usr/bin/env node
import * as path from 'path';
import * as fs from 'mz/fs';
import { write } from './';

(async function run() {
  console.log('Parsing and writing posts');

  const xml = await fs.readFile(path.resolve('input/export.xml'), 'utf8');

  await write(xml);

  console.log('Posts written');
})();
