import axios from 'axios';
import * as qs from 'qs';
import * as Remark from 'remark';
import * as map from 'unist-util-map';
import * as cheerio from 'cheerio';

import { turndown } from './turndown';
import { WORDPRESS_UPLOAD_PATH } from '../constants';
import { gistUrlMapper } from './gist-mapper';

export interface MarkdownResult {
  markdown: string;
  iframe?: string;
  images: string[];
  addjsReplacements: number; //Temp value during dev to make sure we're finding all the addjs occurrences
}

const escape = str => str.replace(/\\([-_`\[\]])/g, '$1');

/*
 * This is a pretty naive approach of detecting markdown
 * It works by splitting and if any line contains a markdown header (#)
 * code fenced block, or separator
 */
export function isMarkdown(html: string): boolean {
  return html.split('\n').some(line => {
    return !!line.match(/(#{1,6}\s?\w+)|```|___/);
  });
}

export async function toMarkdown(html: string): Promise<MarkdownResult> {
  let content = html.replace(/\n\s*?\n/gi, '<br/><br/>');
  let markdown = escape(turndown.turndown(content.trim()).trim());
  let addjsReplacements = 0;
  if (hasAddjsLink(markdown)) {
    markdown = markdown.replace('addjs="', 'addjs src="'); //Replace the one occurrence of missing ` src`
    const matches =
      // Handles " and ', missing closing quotes, no-break space chars
      // For some reason \p{Z} isn't matching, so use \u00A0 instead
      markdown.match(/\[(addjs)[\s\u00A0]+src=["']([^"'\\\]]+)["'\\\]]+/g) ||
      [];
    //
    let expecting = 0;
    let expectedMatches = '';

    for (let match of markdown.match(/addjs.{50}/g) || []) {
      expecting++;
      expectedMatches = expectedMatches + match + '\n';
    }

    let i = 0;

    for (let match of matches) {
      markdown = markdown.replace(match, await addjsToCodeFence(match));
      i++;
    }

    if (expecting != i) {
      console.log('Expected ' + expecting + ' but matched ' + i);
      console.log(expectedMatches);
    }

    addjsReplacements = i;
  }

  const remark = new Remark().data(`settings`, {
    commonmark: false,
    footnotes: true,
    pedantic: true,
    rule: '_',
    ruleSpaces: false,
  });

  const $ = cheerio.load(html);

  let images = [];
  const frames = $('iframe, object').map(function(i, el) {
    return $(this).attr('src');
  });
  const ast = map(remark.parse(markdown), node => {
    if (node.type === 'image' && node.url.indexOf(WORDPRESS_UPLOAD_PATH) > -1) {
      const imagePath = node.url.split(WORDPRESS_UPLOAD_PATH).pop();
      node.url = `images/${imagePath}`;
    }
    return node;
  });

  return {
    markdown: remark.stringify(ast, {
      fences: true,
    }),
    iframe: Array.from(frames).shift() as string,
    images,
    addjsReplacements: addjsReplacements,
  };
}

const hasAddjsLink = (content: string) => {
  return /\[addjs/.test(content);
};

function getLanguage(src: string) {
  try {
    if (src.indexOf('?') > -1) {
      return qs
        .parse(src.split('?').pop())
        .file.split('.')
        .pop();
    }
    return '';
  } catch (e) {
    return '';
  }
}

function getSrcFromAddJs(addjs: string) {
  const src = addjs.split('src=');
  if (src) {
    return src
      .pop()
      .replace(/["'\\\]]/g, '')
      .trim();
  }
  return '';
}

function fixUrl(url: string) {
  const origContentUrl = url
    .replace('github', 'githubusercontent')
    .replace(/\.js(\?file=)?/, '/raw/');
  const replacementUrl = gistUrlMapper[origContentUrl];
  return replacementUrl || origContentUrl;
}

export const addjsToCodeFence = async (addjs: string): Promise<string> => {
  const src = getSrcFromAddJs(addjs);
  const contentUrl = fixUrl(src);
  try {
    const response = await axios.get(contentUrl);
    const language = getLanguage(src);
    const codeBlock = ['', '```' + language, response.data, '```', ''];
    if (!language) {
      codeBlock.push('<!-- TODO: Add language to code block above -->');
    }

    return '\n' + codeBlock.join('\n') + '\n';
  } catch (e) {
    console.log('ERROR: Failed to load raw code content');
    console.log('addjs: ' + addjs);
    console.log('src: ' + src);
    console.log('contentUrl: ' + contentUrl);
    console.log('Failed to get ' + contentUrl);
    return [
      '',
      '<!-- TODO: Replace with code snippet manually pulled from Github -->',
      `[Code](${src})`,
      '',
    ].join('\n\n');
  }
};
