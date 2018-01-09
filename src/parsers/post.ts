import { Author, Post } from '../interfaces';

export function parsePosts(input: Object, authors: Author[], tagName = 'item'): Post[] {
  const posts = input[tagName];
  if (!posts) {
    return [];
  }
  const authorsLookup = authors
    .reduce((merged, author) => {
      merged[author.id] = {
        ...author,
        ...(merged[author.id] || {}),
      };
      return merged;
    }, {
      admin: {
        name: 'Object Partners'
      },
      jbaso: {
        name: 'Jon Baso'
      }
    });
  return posts
    .reduce((merged, post) => {
      if (post['wp:post_type'] === 'post' && post['wp:status'] === 'publish') {
        const author = post['dc:creator'];
        const tags = new Set([].concat(post.category || [])
          .map(tag => (tag.$.nicename || '').toLowerCase())
          .filter(tag => tag && tag !== 'blog'));
        merged.push({
          author: (authorsLookup[author] || { [name]: author }).name,
          content: post.content || post['content:encoded'].replace(/\[\/?markdown\]/g, ''),
          date: new Date(post.pubDate).toJSON(),
          link: post.link,
          slug: post['wp:post_name'],
          tags: Array.from(tags),
          title: post.title
        });
      }
      return merged;
    }, []);
}
