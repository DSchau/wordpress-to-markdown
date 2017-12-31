import { isMarkdown, toMarkdown } from '../to-markdown';

test('it detects markdown', () => {
  [
    `# Hello World`,
    '```\nalert("hello world")```',
    `
some content
___
    `
  ]
    .forEach(sample => {
      expect(isMarkdown(sample)).toBe(true);
    });
});

test('it translates html to markdown', () => {
  expect(toMarkdown(`
<h1>Hello World</h1>

<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>

<hr>
  `)).toBe(`
# Hello World

-   Item One
-   Item Two

___
  `.trim());
});

describe('pre translation to code fence', () => {
  test('it translates simple pre block', () => {
    expect(toMarkdown(`
<pre>
alert('hello world');

alert('hi');
</pre>
    `)).toBe(`
\`\`\`
alert('hello world');

alert('hi');
\`\`\`
    `.trim());
  });

  test('it translates pre block with language', () => {
    expect(toMarkdown(`
<pre lang="groovy">
import groovy.xml.MarkupBuilder

def xml = new MarkupBuilder()
</pre>
    `)).toBe(`
\`\`\`groovy
import groovy.xml.MarkupBuilder

def xml = new MarkupBuilder()
\`\`\`
    `.trim());
  });

  test('it does _not_ apply code fence to a block without a new line', () => {
    expect(toMarkdown(`
<pre lang="js">
var a = 'b';
</pre>
    `)).toBe('`var a = \'b\';`');
  });
});
