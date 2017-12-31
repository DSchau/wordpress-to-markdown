export interface Post {
  author: string; // dc:creator
  content: string; // wp:content or wp:content:encoded
  date: string; // pubDate
  link?: string; // link
  slug: string; // wp:post_name
  title: string; // title
}
