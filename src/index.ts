import { parseString } from 'xml2js';
import * as fs from 'mz/fs';

import * as pify from 'pify';

import { parseAuthors, parsePosts } from './parsers';
import { writeAuthors, writePosts } from './writers';

const parseStringPromise = pify(parseString);

export async function parse(input: string): Promise<any> {
  const parsed = await parseStringPromise(input, {
    explicitArray: false
  });

  if (!parsed.rss) {
    throw new Error('Could not parse Wordpress output format');
  }

  const base = parsed.rss.channel;

  const authors = parseAuthors(base);
  const posts = parsePosts(base, authors);

  return {
    authors,
    posts
  };
}

export async function write(input: string): Promise<any> {
  const parsed = await parse(input);

  await Promise.all([
    writeAuthors(parsed.authors),
    writePosts(parsed.posts)
  ]);
}
