import { Author } from '../interfaces';

export function parseAuthors(input: Object, tagName = 'wp:author'): Author[] {
  const authors = input[tagName];
  if (!authors) {
    return [];
  }
  return authors.map(author => ({
    id: author['wp:author_login'],
    email: author['wp:author_email'],
    name: author['wp:author_display_name'],
  }));
}
