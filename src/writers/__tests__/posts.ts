jest.mock('mz/fs');
import { writeFile } from 'mz/fs';
import * as matter from 'gray-matter';
import { writePost } from '../posts';

import { Post } from '../../interfaces';
import { author, content, date, slug, title } from '../__fixtures__/sample-post';

let post: Post;
let mockWriteFile: jest.Mock<Function>;
beforeEach(() => {
  mockWriteFile = writeFile as jest.Mock<Function>;
  mockWriteFile.mockReset();
  post = {
    author,
    content,
    date,
    slug,
    title
  };
});

test('it adds frontmatter to the markdown', async () => {
  await writePost(post, '1234fakepath');

  const [, markdown] = mockWriteFile.mock.calls.pop();
  const { data } = matter(markdown);

  expect(data.author).toBe(author);
  expect(data.title).toBe(title);
  expect(data.slug).toBe(slug);
  expect(data.date).toEqual(new Date(date));
});

test('it writes correct folder', async () => {
  await writePost(post, '1234fakepath');

  const [filePath] = mockWriteFile.mock.calls.pop();
  expect(filePath).toMatch(`2017/12-20-${slug}`);
});
