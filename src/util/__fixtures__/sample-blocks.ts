export const old_style_gist_block_content =
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

/*
    Taken from 2017-12-05-android-architecture-components
    Any pre with a lang should result in a fenced code block,
    or at minimum, because this pre is on it's on line,
    it should end up on it's own line (with surrounding empty lines) in the MD
    NOTE: This example also has ” added to the lang
 */
export const sample_single_line_pre = `
To get started with adding ViewModel, you must first add:
<pre lang="”java”">implementation "android.arch.lifecycle:extensions:1.0.0"</pre>
to your application build.gradle file.`;
