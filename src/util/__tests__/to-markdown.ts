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
    const html =
      'Text before gist with <div>div that should not be replaced</div>' +
      '<div id="gist5672473" class="gist" >' +
      ' <div class="gist-file">' +
      '  <div class="gist-data gist-syntax">' +
      '   <div class="file-data">' +
      '    <table cellpadding="0" cellspacing="0" class="lines highlight">' +
      '     <tbody>' +
      '     <tr>' +
      '      <td class="line-numbers">' +
      '       <span class="line-number" id="file-service-groovy-L1" >1</span>' +
      '       <span class="line-number" id="file-service-groovy-L2" >2</span>' +
      '      </td>' +
      '      <td class="line-data" >' +
      '       <pre class="line-pre">' +
      '        <div class="line" id="file-service-groovy-LC1">' +
      '        <span class="kd" >class</span> ' +
      '         <span class="nc" >LocalPaymentService</span> ' +
      '         <span class="kd" >implements</span> <span class="n">PaymentService</span> ' +
      '         <span class="o">{</span></div>' +
      '        <div class="line" id="file-service-groovy-LC2">  </div></pre>' +
      '      </td>' +
      '     </tr>' +
      '     </tbody>' +
      '    </table>' +
      '   </div>' +
      '  </div>' +
      '  <div class="gist-meta">' +
      '   <a href="https://gist.github.com/danveloper/5672473/raw/c2b001d99d2e9488633b632495a878c8f26595eb/Service.groovy" ' +
      'style="float: right;color: #369">view raw</a>' +
      '      <a href="https://gist.github.com/danveloper/5672473#file-service-groovy">Service.groovy</a>' +
      '      <a href="https://gist.github.com/danveloper/5672473" >This Gist</a> brought to you by ' +
      '      <a href="http://github.com" >GitHub</a>.' +
      '  </div>' +
      ' </div>' +
      '</div>' +
      'Text after gist';
    const markdown = await toMarkdown(html).then(result => result.markdown);
    expect(markdown).toContain('Text before gist with');
    expect(markdown).toContain('div that should not be replaced');
    expect(markdown).toContain(
      '    class LocalPaymentService implements PaymentService {'
    );
    expect(markdown).not.toContain('5672473'); //gist id
  });
});
