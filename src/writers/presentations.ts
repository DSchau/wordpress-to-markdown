import * as path from 'path';
import * as fs from 'mz/fs';
import * as format from 'date-fns/format';

import * as mkdir from 'mkdirp-promise';

import { template } from '../util';
import { Presentation } from '../interfaces';

export async function writePresentation(
  presentation: Presentation,
  base: string
): Promise<any> {
  const [day, month, year] = format(
    new Date(presentation.date),
    'DD MM YYYY'
  ).split(' ');
  const filePath = path.join(
    base,
    `${year}-${month}-${day}-${presentation.slug}.md`
  );
  return fs.writeFile(filePath, template(presentation), 'utf8');
}

export async function writePresentations(
  presentations: Presentation[],
  basePath = 'output'
) {
  const base = path.resolve(basePath);
  const presentationsBase = path.join(base, 'presentations');

  await mkdir(presentationsBase);

  await Promise.all(
    presentations.map(presentation =>
      writePresentation(presentation, presentationsBase)
    )
  );
}
