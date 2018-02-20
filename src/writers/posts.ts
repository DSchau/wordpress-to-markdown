import * as path from 'path';
import * as fs from 'mz/fs';
import * as mkdir from 'mkdirp-promise';
import * as format from 'date-fns/format';
import axios from 'axios';
import * as globby from 'globby';

import { WORDPRESS_UPLOAD_PATH } from '../constants';
import { template } from '../util';

import { Post } from '../interfaces';

export async function writePost(post: Post, base: string): Promise<any> {
  const [day, month, year] = format(new Date(post.date), 'DD MM YYYY').split(
    ' '
  );
  const filePath = path.join(base, `${year}-${month}-${day}-${post.slug}.md`);
  return fs.writeFile(filePath, template(post), 'utf8');
}

export async function writeImages(posts: Post[], base: string): Promise<any> {
  const imageBase = path.join(base, 'images');
  const cached = await globby(imageBase).then(files =>
    files.reduce((fileObj, file) => {
      const fileName = file
        .split(imageBase)
        .pop()
        .slice(1);
      fileObj[fileName] = true;
      return fileObj;
    }, {})
  );

  return await Promise.all(
    posts.map(({ images }) => {
      const nonCachedImages = images.filter(image => !cached[image]);

      return Promise.all(
        nonCachedImages.map(image => {
          const url = `${WORDPRESS_UPLOAD_PATH}${image}`;
          const dest = path.join(
            imageBase,
            image
              .split('/')
              .slice(0, -1)
              .join('/')
          );
          return mkdir(dest).then(() => {
            return axios
              .get(url, { responseType: 'arraybuffer' })
              .then(response => {
                return fs.writeFile(
                  path.join(imageBase, image),
                  response.data,
                  'binary'
                );
              });
          });
        })
      );
    })
  );
}

export async function writePosts(posts: Post[], basePath = 'output') {
  const base = path.resolve(basePath);
  const postsBase = path.join(base, 'posts');

  await mkdir(postsBase);

  await writeImages(posts, postsBase);

  console.log('Wrote all images');

  await Promise.all(posts.map(post => writePost(post, postsBase)));
}
