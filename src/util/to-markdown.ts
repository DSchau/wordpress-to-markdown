import axios from 'axios';
import * as qs from 'qs';
import * as Remark from 'remark';
import * as map from 'unist-util-map';

import { turndown } from './turndown';
import { WORDPRESS_UPLOAD_PATH } from '../constants';

export interface MarkdownResult {
  markdown: string;
  images: string[];
}

/*
 * This is a pretty naive approach of detecting markdown
 * It works by splitting and if any line contains a markdown header (#)
 * code fenced block, or seperator
 */
export function isMarkdown(html: string): boolean {
  return html.split('\n').some(line => {
    return !!line.match(/(#{1,6}\s?\w+)|```|___/);
  });
}

export async function toMarkdown(html: string): Promise<MarkdownResult> {
  let markdown = turndown.turndown(html.trim()).trim();
  if(hasAddjsLink(markdown)) {
    const matches = markdown.match(/(\\)?\[addjs\s*src="[^"\\]+(["\\\]]+)?/g) || [];
    for (let match of matches) {
      markdown = markdown.replace(match, await addjsToCodeFence(match));
    }
  }

  const remark = new Remark().data(`settings`, {
    commonmark: true,
    footnotes: true,
    pedantic: true,
  });

  let images = [];
  const ast = map(remark.parse(markdown), node => {
    if (node.type === 'image' && node.url.indexOf(WORDPRESS_UPLOAD_PATH) > -1) {
      const imagePath = node.url.split(WORDPRESS_UPLOAD_PATH).pop();
      node.url = `/static/images/${imagePath}`;
      images.push(imagePath);
    }
    return node;
  });

  return { markdown: remark.stringify(ast), images };
}

const hasAddjsLink = (content: string) => {
  return /\[addjs/.test(content);
}

function getLanguage(src: string) {
  try {
    if (src.indexOf('?') > -1) {
      return qs.parse(src.split('?').pop()).file.split('.').pop();
    }
    return '';
  } catch (e) {
    return '';
  }
}

function getSrcFromAddJs(addjs: string) {
  const src = addjs.split('src=');
  if (src) {
    return src.pop().replace(/["\\\]]/g, '').trim();
  }
  return '';
}

export const addjsToCodeFence = async (addjs: string): Promise<string> => {
  const src = getSrcFromAddJs(addjs);
  const contentUrl = src
    .replace('github', 'githubusercontent')
    .replace(/\.js(\?file=)?/, '/raw/');
  try {
    const response = await axios.get(contentUrl);
    const language = getLanguage(src);
    return '\n' + [
      '',
      !language && '<!-- TODO: Add language to code block -->',
      '```' + language,
      response.data,
      '```',
      ''
    ]
      .join('\n') + '\n';
  } catch(e) {
    return [
      '',
      '<!-- TODO: Replace with code snippet manually pulled from Github -->',
      `[Code](${src})`,
      ''
    ].join('\n\n');
  }
}
