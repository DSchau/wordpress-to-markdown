import { parseString } from 'xml2js';
import * as fs from 'mz/fs';

import * as pify from 'pify';

import { parseAuthors, parsePosts, parsePresentations } from './parsers';
import { writeAuthors, writePosts, writePresentations } from './writers';

const parseStringPromise = pify(parseString);

export async function parse(input: string): Promise<any> {
  const parsed = await parseStringPromise(input, {
    explicitArray: false,
  });

  if (!parsed.rss) {
    throw new Error('Could not parse Wordpress output format');
  }

  const base = parsed.rss.channel;

  const authors = parseAuthors(base);
  const posts = await parsePosts(base, authors);
  const presentations = await parsePresentations(base, authors);

  return {
    authors,
    posts,
    presentations,
  };
}

export async function write(input: string): Promise<any> {
  const { authors, posts, presentations } = await parse(input);

  await Promise.all([
    writeAuthors(authors),
    writePosts(posts),
    writePresentations(presentations),
  ]);
}
