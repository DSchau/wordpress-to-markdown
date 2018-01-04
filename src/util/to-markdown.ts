import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';
import axios from 'axios';

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
      return ['', '```' + (lang === null ? '' : lang), trimmed, '```', '']
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

export const addjsToCodeFence = async (addjs: string) => {
  let contentUrl = addjs.replace('github', 'githubusercontent')
      .replace(/(\.[a-z]*\?file=)|\.js/, '/raw/')
  contentUrl = contentUrl.match(/src="(\S*)"/)[1];
  let response = {};
  try {
    response = await axios.get(contentUrl);
  } catch(e) {
    console.log(`Failed to retrieve snippet for: ${contentUrl}`);
  }
  return (
  `\`\`\`
    ${response.data}
  \`\`\``);
}
