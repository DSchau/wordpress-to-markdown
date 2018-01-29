import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';

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

export { service as turndown }
