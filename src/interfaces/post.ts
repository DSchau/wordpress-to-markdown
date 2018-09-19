export interface Meta {
  description: string;
  keywords: string[];
  title: string;
}

export interface Post {
  author: string; // dc:creator
  category: string;
  raw: string; // wp:content or wp:content:encoded
  markdown: string;
  images: string[];
  date: string; // pubDate
  link?: string; // link
  slug: string; // wp:post_name
  title: string; // title
  tags: string[];
  meta?: Partial<Meta>;
  addjsReplacements: number; //Temp value during dev to make sure we're finding all the addjs occurrences
}
