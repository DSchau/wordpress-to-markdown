import * as path from 'path';
import * as fs from 'mz/fs';
import * as mkdir from 'mkdirp-promise';
import * as format from 'date-fns/format';
import * as Turndown from 'turndown';

import { Post } from '../interfaces';

const template = (post: Post, turndown: Turndown): string => `
---
author: ${post.author}
title: ${post.title}
date: ${post.date}
slug: ${post.slug}
---

${turndown.turndown(post.content, {
  codeBlockStyle: 'fenced',
  headingStyle: 'atx'
})}
`.trim() + '\n';

export async function writePosts(posts: Post[], basePath = 'output/posts') {
  const base = path.resolve(basePath);

  await mkdir(base);

  const turndown = new Turndown();

  await Promise.all(
    posts
      .map(post => {
        const [day, month, year] = format(new Date(post.date), 'DD MM YYYY').split(' ');
        const folder = path.join(base, year, `${month}-${day}-${post.slug}`);
        return mkdir(folder)
          .then(() => {
            return fs.writeFile(path.join(folder, 'index.md'), template(post, turndown), 'utf8');
          });
      })
  );
}