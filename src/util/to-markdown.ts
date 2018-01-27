import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';
import axios from 'axios';
import * as qs from 'qs';

const service = new Turndown({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  hr: '___'
});

const escape = str => str
  .replace(/\\([-_`\[\]])/g, '$1');

// TODO: it seems like code blocks may be unescaped improperly
service.addRule('code-fencing', {
  filter: ['pre'],
  replacement(content, node) {
    const trimmed = escape(content ? content.trim() : '');
    if (trimmed.match('\n')) {
      const lang = node.getAttribute('lang');
      return [
        '',
        lang === null ? '<!-- TODO: Add language to code block -->' : '',
        '```' + (lang === null ? '' : lang), trimmed, '```',
        ''
      ]
        .join('\n');
    }
    return ['`', trimmed, '\`'].join('');
  }
});

service.use(githubFlavoredMarkdown);

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

export async function toMarkdown(html: string): Promise<string> {
  let markdown = html.trim();
  if (!isMarkdown(html)) {
    markdown = service.turndown(html).trim();
  }
  if(hasAddjsLink(markdown)) {
    const matches = markdown.match(/(\\)?\[addjs\s*src="[^"\\]+(["\\\]]+)?/g);
    if(!matches) {
      return null;
    }
    if (markdown.indexOf('Recently I had the opportunity to rewrite an existing Spring Boot application as a Ratpack application') > -1) {
    }
    for (let match of matches) {
      markdown = markdown.replace(match, await addjsToCodeFence(match));
    }
  }
  return markdown;
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
