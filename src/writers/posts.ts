import * as path from 'path';
import * as fs from 'mz/fs';
import * as mkdir from 'mkdirp-promise';
import * as format from 'date-fns/format';

import { toMarkdown } from '../util';

import { Post } from '../interfaces';

const replace = str => str.replace(/["]/g, '\"');

const writeArr = (arr: string[], key = 'tags', spaces = 2): string => {
  if (!arr || arr.length === 0) {
    return '';
  }
  return `
${key}:
${arr.map(tag => `${new Array(spaces + 1).join(' ')}- ${tag}`).join('\n')}
  `.trim();
};

const metadata = (post: Post): string => {
  return `
${`
author: ${post.author}
title: "${replace(post.title)}"
date: ${new Date(post.date).toJSON()}
slug: ${post.slug}
${writeArr(post.tags)}
${post.meta ? `
meta:
  description: "${replace(post.meta.description || post.title)}"
  title: "${replace(post.meta.title || post.title)}"
  ${writeArr(post.meta.keywords, 'keywords', 4)}
` : ''}
`}
  `.trim().replace(/\n+/g, '\n');
}

const template = (post: Post): string => `
---
${metadata(post)}
---

${post.content}
`.trim() + '\n';

export async function writePost(post: Post, base: string): Promise<any> {
  const [day, month, year] = format(new Date(post.date), 'DD MM YYYY').split(' ');
  const folder = path.join(base, year, `${month}-${day}-${post.slug}`);
  post.content = await toMarkdown(post.content);
  return mkdir(folder)
    .then(() => {
      return fs.writeFile(path.join(folder, 'index.md'), template(post), 'utf8');
    });
}

export async function writePosts(posts: Post[], basePath = 'output/posts') {
  const base = path.resolve(basePath);

  await mkdir(base);

  await Promise.all(
    posts
      .map(post => writePost(post, base))
  );
}