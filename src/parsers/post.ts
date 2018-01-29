import { toMarkdown } from '../util/to-markdown';

import { Author, Post } from '../interfaces';

const CATEGORIES = {
  java: 'JVM',
  javascript: 'JavaScript',
  devops: 'Devops',
  mobile: 'Mobile',
  company: 'Company'
}

const CATEGORY_MAP = {
  javascript: CATEGORIES.javascript,
  react: CATEGORIES.javascript,
  angular: CATEGORIES.javascript,
  angularjs: CATEGORIES.javascript,
  jquery: CATEGORIES.javascript,
  node: CATEGORIES.javascript,
  nodejs: CATEGORIES.javascript,
  vue: CATEGORIES.javascript,
  npm: CATEGORIES.javascript,
  web: CATEGORIES.javascript,
  css: CATEGORIES.javascript,
  reactjs: CATEGORIES.javascript,
  java: CATEGORIES.java,
  mobile: CATEGORIES.mobile,
  android: CATEGORIES.mobile,
  cordova: CATEGORIES.mobile,
  ios: CATEGORIES.mobile,
  xcode: CATEGORIES.mobile,
  devops: CATEGORIES.devops,
  gradle: CATEGORIES.java,
  spring: CATEGORIES.java,
  groovy: CATEGORIES.java,
  grails: CATEGORIES.java,
  eclipse: CATEGORIES.java,
  spock: CATEGORIES.java,
  ratpack: CATEGORIES.java,
  'spring-boot': CATEGORIES.java,
  kotlin: CATEGORIES.java,
  tomcat: CATEGORIES.java,
  mockito: CATEGORIES.java,
  junit: CATEGORIES.java,
  mave: CATEGORIES.java,
  docker: CATEGORIES.devops,
  jenkins: CATEGORIES.devops,
  terraform: CATEGORIES.devops,
  lambda: CATEGORIES.devops,
  s3: CATEGORIES.devops,
  holiday: CATEGORIES.company,
  house: CATEGORIES.company,
  'partners': CATEGORIES.company
}

function getCategory(tags: Set<string>, title: string): string {
  const titleWords = new Set(title.split(' ').map(word => word.toLowerCase()));

  const findCategory = (set: Set<string>): string | null => Object.keys(CATEGORY_MAP).find(category => {
    if (set.has(category)) {
      return true;
    }
    return Array.from(set).some(val => {
      return new Set(val.split(/[-\s]/)).has(category);
    })
  });

  const category = findCategory(tags) || findCategory(titleWords);

  if (category) {
    return CATEGORY_MAP[category];
  }

  return 'Unknown';
}

export async function parsePosts(input: Object, authors: Author[], tagName = 'item'): Promise<Post[]> {
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
  let merged = [];

  await Promise.all(
    posts.map(async post => {
      const isBlogPost = [].concat(post.category)
        .some(category => category && category._ === 'Blog');
      if (post['wp:post_type'] === 'post' && post['wp:status'] === 'publish' && isBlogPost) {
        const author = post['dc:creator'];
        const tags = new Set([].concat(post.category || [])
          .map(tag => (tag.$.nicename || '').toLowerCase())
          .filter(tag => tag && tag !== 'blog'));
        const meta = [].concat(post['wp:postmeta'] || [])
          .reduce((merged, tag) => {
            const value = tag['wp:meta_value'];
            switch (tag['wp:meta_key']) {
              case '_aioseop_description':
                merged.description = value;
                break;
              case '_aioseop_title':
                merged.title = value;
                break;
              case '_aioseop_keywords':
                merged.keywords = value.split(/\s*,\s*/);
                break;
              default:
                break;
            }
            return merged;
          }, {});


        const raw = post.content || post['content:encoded'].replace(/\[\/?markdown\]/g, '');
        const { markdown, images } = await toMarkdown(raw);

        // console.log(`${post.title} -> ${post.title}.markdown`);

        merged.push({
          author: (authorsLookup[author] || { name: author }).name,
          category: getCategory(tags, post.title),
          raw,
          markdown,
          images,
          date: new Date(post.pubDate).toISOString(),
          link: post.link,
          slug: post['wp:post_name'],
          tags: Array.from(tags),
          title: post.title,
          ...(meta && Object.keys(meta).length > 0 ? { meta } : {})
        });
      }
    })
  )

  return merged;
}
