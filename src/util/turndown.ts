import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';

// Note: MD generated by Turndown might get overwritten by Remark processing later
const service = new Turndown({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  hr: '___',
});

const escape = str => str.replace(/\\([-_`\[\]])/g, '$1');

service.addRule('old-gh-gist', {
  filter: ['div'],
  replacement(content, node) {
    const replace = node.className === 'gist';
    let result = '\n\n' + content + '\n\n';
    if (replace) {
      const regex = /<a href="([^"]+?)".*?>view raw<\/a>/;
      let matches = ('' + node.outerHTML).match(regex);
      const match = matches[1];
      // console.log('Found "view raw" link:' + match);
      result = '[addjs src="' + match + '"]';
    }
    return result;
  },
});

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
        '```' + (lang === null ? '' : lang),
        trimmed,
        '```',
        '',
      ].join('\n');
    }
    return ['`', trimmed, '`'].join('');
  },
});

service.use(githubFlavoredMarkdown);

export { service as turndown };