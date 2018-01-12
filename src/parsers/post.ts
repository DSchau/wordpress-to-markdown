import { Author, Post } from '../interfaces';

const CATEGORIES = {
  java: 'Java',
  javascript: 'JavaScript',
  devops: 'Devops',
  mobile: 'Mobile'
}

const CATEGORY_MAP = {
  javascript: CATEGORIES.javascript,
  react: CATEGORIES.javascript,
  angular: CATEGORIES.javascript,
  jquery: CATEGORIES.javascript,
  node: CATEGORIES.javascript,
  nodejs: CATEGORIES.javascript,
  java: CATEGORIES.java,
  mobile: CATEGORIES.mobile,
  android: CATEGORIES.mobile,
  ios: CATEGORIES.mobile,
  xcode: CATEGORIES.mobile,
  devops: CATEGORIES.devops,
  gradle: CATEGORIES.java,
  spring: CATEGORIES.java,
  groovy: CATEGORIES.java,
  'spring-boot': CATEGORIES.java,
  kotlin: CATEGORIES.java,
  tomcat: CATEGORIES.java,
  docker: CATEGORIES.devops,
  terraform: CATEGORIES.devops
}

function getCategory(tags: Set<string>) {
  if (tags.size === 0) {
    return 'Unknown';
  }

  const category = Object.keys(CATEGORY_MAP).find(category => tags.has(category));

  if (category) {
    return CATEGORY_MAP[category];
  }
  
  return 'Unknown';
}

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
      const isBlogPost = [].concat(post.category)
        .some(category => category && category._ === 'Blog');
      if (post['wp:post_type'] === 'post' && post['wp:status'] === 'publish' && isBlogPost) {
        const author = post['dc:creator'];
        const tags = new Set([].concat(post.category || [])
          .map(tag => (tag.$.nicename || '').toLowerCase())
          .filter(tag => tag && tag !== 'blog'));
        merged.push({
          author: (authorsLookup[author] || { name: author }).name,
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
