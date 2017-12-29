import * as path from 'path';
import * as fs from 'mz/fs';
import * as mkdir from 'mkdirp-promise';
import * as format from 'date-fns/format';

import { toMarkdown } from '../util';

import { Post } from '../interfaces';

const template = (post: Post, toMarkdown): string => `
---
author: ${post.author}
title: "${post.title.replace(/["']/g, '')}"
date: ${post.date}
slug: ${post.slug}
---

${toMarkdown(post.content)}
`.trim() + '\n';

export async function writePosts(posts: Post[], basePath = 'output/posts') {
  const base = path.resolve(basePath);

  await mkdir(base);

  await Promise.all(
    posts
      .map(post => {
        const [day, month, year] = format(new Date(post.date), 'DD MM YYYY').split(' ');
        const folder = path.join(base, year, `${month}-${day}-${post.slug}`);
        return mkdir(folder)
          .then(() => {
            return fs.writeFile(path.join(folder, 'index.md'), template(post, toMarkdown), 'utf8');
          });
      })
  );
}