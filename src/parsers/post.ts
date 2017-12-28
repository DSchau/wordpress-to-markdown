import { Author, Post } from '../interfaces';

export function parsePosts(input: Object, authors: Author[], tagName = 'item'): Post[] {
  const posts = input[tagName];
  if (!posts) {
    return [];
  }
  const authorsLookup = authors
    .reduce((merged, author) => {
      merged[author.id] = author;
      return merged;
    }, {});
  return posts
    .reduce((merged, post) => {
      if (post['wp:post_type'] === 'post' && post['wp:status'] === 'publish') {
        const author = post['dc:creator'];
        merged.push({
          author: (authorsLookup[author] || { name: author }).name,
          content: post.content || post['content:encoded'],
          date: new Date(post.pubDate).toJSON(),
          link: post.link,
          slug: post['wp:post_name'],
          title: post.title
        });
      }
      return merged;
    }, []);
}
