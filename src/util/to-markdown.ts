import * as Turndown from 'turndown';
import { gfm as githubFlavoredMarkdown } from 'turndown-plugin-gfm';

const service = new Turndown({
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
  hr: '___'
});

// service.use(githubFlavoredMarkdown);

export function isMarkdown(html: string): boolean {
  return html.split('\n').some(line => {
    return !!line.match(/(#{1,6}|```)/);
  });
}

export function toMarkdown(html: string): string {
  if (!isMarkdown(html)) {
    return service.turndown(html);
  }
  return html;
}
