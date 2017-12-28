import * as path from 'path';
import * as fs from 'mz/fs';
import * as mkdir from 'mkdirp-promise';

import { slugify} from '../util';

import { Author } from '../interfaces';

const template = (author: Author): string => `
---
name: ${author.name}
title: Senior Consultant
avatar: avatar.jpeg
---

Insert witty bio here

`.trim() + '\n';

export async function writeAuthors(authors: Author[], basePath = 'output/persons') {
  const base = path.resolve(basePath);
  await mkdir(base);

  await Promise.all(
    authors
      .map(author => {
        const folder = path.join(base, slugify(author.name));
        return mkdir(folder)
          .then(() => {
            return fs.writeFile(path.join(base, slugify(author.name), 'index.md'), template(author), 'utf8')
          });
      })
  );
}
