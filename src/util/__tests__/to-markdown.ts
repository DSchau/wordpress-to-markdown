import { isMarkdown, toMarkdown, addjsToCodeFence } from '../to-markdown';

test('it detects markdown', () => {
  [
    `# Hello World`,
    '```\nalert("hello world")```',
    `
some content
___
    `,
  ].forEach(sample => {
    expect(isMarkdown(sample)).toBe(true);
  });
});

test('it translates html to markdown', async () => {
  expect(
    await toMarkdown(`
<h1>Hello World</h1>

<ul>
  <li>Item One</li>
  <li>Item Two</li>
</ul>

<hr>
  `)
  ).toBe(
    `
# Hello World

-   Item One
-   Item Two

___
  `.trim()
  );
});

describe('pre translation to code fence', () => {
  test('it translates simple pre block', async () => {
    expect(
      await toMarkdown(`
<pre>
alert('hello world');

alert('hi');
</pre>
    `)
    ).toBe(
      `
\`\`\`
alert('hello world');

alert('hi');
\`\`\`
    `.trim()
    );
  });

  test('it translates pre block with language', async () => {
    expect(
      await toMarkdown(`
<pre lang="groovy">
import groovy.xml.MarkupBuilder

def xml = new MarkupBuilder()
</pre>
    `)
    ).toBe(
      `
\`\`\`groovy
import groovy.xml.MarkupBuilder

def xml = new MarkupBuilder()
\`\`\`
    `.trim()
    );
  });

  test('it does _not_ apply code fence to a block without a new line', async () => {
    expect(
      await toMarkdown(`
<pre lang="js">
var a = 'b';
</pre>
    `)
    ).toBe("`var a = 'b';`");
  });

  test('addjs', async () => {
    const result = await addjsToCodeFence(
      '[addjs src="https://gist.github.com/JakePartusch/50737c37e988759e66b6.js?file=angular-controller.js"\\]'
    );
    expect(result).toMatchSnapshot();
  });

  test('it translates addjs links', async () => {
    expect(
      await toMarkdown(`
    Angular 1.x: \[addjs src="https://gist.github.com/JakePartusch/50737c37e988759e66b6.js?file=angular-controller.js"\] Angular 2.0: \[addjs src="https://gist.github.com/JakePartusch/d5863172113a92fc493d.js?file=angular2-component.ts"\]
    `)
    ).toMatchSnapshot();
  });
});
