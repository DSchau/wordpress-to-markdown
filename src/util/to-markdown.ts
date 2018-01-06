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

// TODO: it seems like code blocks may be unescaped improperly
service.addRule('code-fencing', {
  filter: ['pre'],
  replacement(content, node) {
    const trimmed = content ? content.trim() : '';
    if (trimmed.match('\n')) {
      const lang = node.getAttribute('lang');
      return [
        '',
        lang === null ? '<!-- TODO: Add language to code block -->' : '',
        '```' + (lang === null ? '' : lang), trimmed, '```', '']
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
    const matches = markdown.match(/\[addjs src="\S*".*?\]/g);
    if(!matches) {
      return null;
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
  const src = addjs.match(/(?:src=")(.+)(?:")/);
  if (src) {
    return src.pop();
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
    return [
      !language && '<!-- TODO: Add language to code block -->',
      '```' + language,
      response.data,
      '```'
    ]
      .filter(value => value && value.length > 0)
      .join('\n');
  } catch(e) {
    console.log(`Failed to retrieve snippet for: ${src} from raw ${contentUrl}`);
    return [
      '<!-- TODO: Replace with code snippet manually pulled from Github -->',
      `[Code](${src})`
    ].join('\n');
  }
}
