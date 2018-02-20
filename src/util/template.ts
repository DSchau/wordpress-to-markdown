import { Post, Presentation } from '../interfaces';

export const replace = str => str.replace(/["']/g, '').trim();

export const writeArr = (arr: string[], key = 'tags', spaces = 2): string => {
  if (!arr || arr.length === 0) {
    return '';
  }
  return `
${key}:
${arr
    .map(tag => `${new Array(spaces).join(' ')} - "${replace(tag)}"`)
    .join('\n')}
  `.trim();
};

export const metadata = (post: Post | Presentation): string => {
  return `
${`
author: ${post.author}
title: "${replace(post.title)}"
date: ${new Date(post.date).toJSON()}
category: ${post.category}
slug: ${post.slug}
${writeArr(post.tags)}
${
    post.meta
      ? `
meta:
  description: "${replace(post.meta.description || post.title)}"
  ${writeArr(post.meta.keywords || [], 'keywords', 4)}
`
      : ''
  }
`}
  `
    .trim()
    .replace(/\n+/g, '\n');
};

export const template = (post: any): string =>
  `
---
${metadata(post)}
---

${post.markdown}
${
    post.iframe
      ? `<iframe width="854" height="480" src="${
          post.iframe
        }" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`
      : ''
  }
`.trim() + '\n';
