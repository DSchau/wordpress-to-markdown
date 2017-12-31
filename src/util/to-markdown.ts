import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';

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

export function toMarkdown(html: string): string {
  if (!isMarkdown(html)) {
    return service.turndown(html).trim();
  }
  return html.trim();
}
