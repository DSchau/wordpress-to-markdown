/**
  Some of the gists in posts are not retrievable with the parser we have, so they are marked with a comment to
   > Replace with code snippet manually pulled from Github <

  This is a work around of the problem.

  Taking off the `/raw` from the URL usually takes you to the Gist in question.
  From there, clicking on the RAW button takes you to the raw gist.
  Some where just missing the https:// in front.

  This util just maps the bad URL to the good URL.
 */

export const gistUrlMapper = {
  'gist.githubusercontent.com/manijshrestha/d7a7ff6fa50ba0ad9509/raw/':
    'https://gist.githubusercontent.com/manijshrestha/d7a7ff6fa50ba0ad9509/raw/',
  '//gist.githubusercontent.com/manijshrestha/ae66dc495a32b69e1ef4/raw/':
    'https://gist.githubusercontent.com/manijshrestha/ae66dc495a32b69e1ef4/raw/',
  '//gist.githubusercontent.com/manijshrestha/be7382f784e9660e7c64/raw/':
    'https://gist.githubusercontent.com/manijshrestha/be7382f784e9660e7c64/raw/',
  '//gist.githubusercontent.com/manijshrestha/87036095a22870c4dc5d/raw/':
    'https://gist.githubusercontent.com/manijshrestha/87036095a22870c4dc5d/raw/',
  '//gist.githubusercontent.com/manijshrestha/6b9db446e9b795cf440a/raw/':
    'https://gist.githubusercontent.com/manijshrestha/6b9db446e9b795cf440a/raw/',
  '//gist.githubusercontent.com/manijshrestha/7d5a94cb0a8b5bdc862e/raw/':
    'https://gist.githubusercontent.com/manijshrestha/7d5a94cb0a8b5bdc862e/raw/',
  '//gist.githubusercontent.com/manijshrestha/24f85b8177837e286845/raw/':
    'https://gist.githubusercontent.com/manijshrestha/24f85b8177837e286845/raw/',
  '//gist.githubusercontent.com/manijshrestha/1a67d9c15c95bdd84788/raw/':
    'https://gist.githubusercontent.com/manijshrestha/1a67d9c15c95bdd84788/raw/',
  '//gist.githubusercontent.com/manijshrestha/62fe7f9755c9f265ae11/raw/':
    'https://gist.githubusercontent.com/manijshrestha/62fe7f9755c9f265ae11/raw/',
  '//gist.githubusercontent.com/manijshrestha/aab483111d489b5e42ab/raw/':
    'https://gist.githubusercontent.com/manijshrestha/aab483111d489b5e42ab/raw/',
  'https://gist.githubusercontent.com/c47c3e55028f6c0720fdadca19973f65/raw/':
    'https://gist.githubusercontent.com/mike-plummer/c47c3e55028f6c0720fdadca19973f65/raw/' +
    'c7bbc804ca52ff83eb1a9fff18d50e602f036727/Angular-example.ts',
  'https://gist.githubusercontent.com/2b4cb638c1b569bea4fb/raw/':
    'https://gist.githubusercontent.com/mike-plummer/2b4cb638c1b569bea4fb/raw/' +
    'a7122399b60c314b6a87facc822d3b327aad80fe/nativegroovy.c',
  'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/266ab0d6ccf8da343b05f39ab5d53e9c9d0263ef/raw/':
    'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/raw/' +
    '266ab0d6ccf8da343b05f39ab5d53e9c9d0263ef/transforms.js',
  'https://gist.githubusercontent.com/546204cb98d03056dd6426387f8c8b2b/raw/':
    'https://gist.githubusercontent.com/mike-plummer/546204cb98d03056dd6426387f8c8b2b/raw/' +
    'fa1323ad48a97a866a992c12c091edb13f10a483/Angular-example.html',
  'https://gist.githubusercontent.com/83e128accac23c18dffc/raw/':
    'https://gist.githubusercontent.com/mike-plummer/83e128accac23c18dffc/raw/' +
    '74b37e5b9849dd601f6f1fde3df4b56a9d39f2a9/nativegroovy.h',
  'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/69c014e1a371dfb5006de7a279c52a72ed3adaa1/raw/':
    'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/raw/' +
    '69c014e1a371dfb5006de7a279c52a72ed3adaa1/transforms.js',
  'https://gist.githubusercontent.com/ca4427a925418c07206173e5b7cd2bb6/raw/':
    'https://gist.githubusercontent.com/mike-plummer/ca4427a925418c07206173e5b7cd2bb6/raw/' +
    '01d6e41556bca47b4e0d8f8000dbbeb84a6a9c70/React-example.js',
  'https://gist.githubusercontent.com/17f28e9b75d0738dea58d63982bd7176/raw/':
    'https://gist.githubusercontent.com/mike-plummer/17f28e9b75d0738dea58d63982bd7176/raw/' +
    '49eab7a7dbbb66e9d14e77310c30ead6b694182d/Vue-example.vue',
  'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/5c5668b696aeb6de47f471cb344bfea5a837f666/raw/':
    'https://gist.githubusercontent.com/davidnortonjr/0a573a916333968dd1f9/raw/' +
    '5c5668b696aeb6de47f471cb344bfea5a837f666/transforms.js',
  'https://gist.githubusercontent.com/653bfb0f7e6fccb2a765/raw/':
    'https://gist.githubusercontent.com/mike-plummer/653bfb0f7e6fccb2a765/raw/9aa8618817c223b8031593fb96888b8e85bad1d6',
  'https://gist.githubusercontent.com/c071223053f49b37e211/raw/':
    'https://gist.githubusercontent.com/mike-plummer/c071223053f49b37e211/raw/9c13e092a57aa830df4e72f4a2d56c393ccd3e75',
  'https://gist.githubusercontent.com/bcc468ac45d74c30ffed/raw/':
    'https://gist.githubusercontent.com/mike-plummer/bcc468ac45d74c30ffed/raw/9e14a7e599c7eade804122d7e3460ea77c43e98e',
};
