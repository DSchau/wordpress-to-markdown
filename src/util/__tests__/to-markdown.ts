import { isMarkdown, toMarkdown, addjsToCodeFence } from '../to-markdown';
import { old_style_gist_block_content } from '../__fixtures__/sample-blocks';

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
  `).then(result => result.markdown)
  ).toBe(
    `
# Hello World

-   Item One
-   Item Two

___
  `
      .trim()
      .concat('\n')
  );
});

test('it respects existing line breaks in the exported posts', async () => {
  const result = await toMarkdown(
    `<strong>Red, red, red, red, green, refactor</strong>

Let's write our test first:`
  ).then(result => result.markdown);
  const matches = result.match(/\n\s*?\n/gi) || [];
  expect(matches.length).toBe(1);
});

test('double line breaks turns into spacing paragraphs in md', async () => {
  const result = await toMarkdown(
    `first line

second line
    code
    
    probably SHOULD leave line breaks in here
done with code

more
`
  ).then(result => result.markdown);
  //console.log(result);
  const matches = result.match(/\n\s*?\n/gi) || [];
  expect(matches.length).toBe(3);
});

test('double br breaks turns into spacing paragraphs in md', async () => {
  expect(
    await toMarkdown(`first line<br/><br/>second line`).then(
      result => result.markdown
    )
  ).toMatch(/first line\s*(\r?\n){2}second line/);
});

describe('pre translation to code fence', () => {
  test('it translates simple pre block', async () => {
    expect(
      await toMarkdown(`
<pre>
alert('hello world');

alert('hi');
</pre>
    `).then(result => result.markdown)
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
    `).then(result => result.markdown)
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
    `).then(result => result.markdown)
    ).toBe("`var a = 'b';`\n");
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
    `).then(result => result.markdown)
    ).toMatchSnapshot();
  });

  test('it translates old style gist blocks', async () => {
    const markdown = await toMarkdown(old_style_gist_block_content).then(
      result => result.markdown
    );
    expect(markdown).toContain('Text before gist with');
    expect(markdown).toContain('div that should not be replaced');
    expect(markdown).toContain(
      '    class LocalPaymentService implements PaymentService {'
    );
    expect(markdown).not.toContain('5672473'); //gist id
  });
});
