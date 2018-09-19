import { toMarkdown } from '../util/to-markdown';

import { getMeta, getTags } from '../util/';
import { Author, Presentation } from '../interfaces';

export async function parsePresentations(
  input: Object,
  authors: Author[],
  tagName = 'item'
): Promise<Presentation[]> {
  const possiblePresentations = input[tagName];

  const authorsLookup = authors.reduce(
    (merged, author) => {
      merged[author.id] = {
        ...author,
        ...(merged[author.id] || {}),
      };
      return merged;
    },
    {
      admin: {
        name: 'Object Partners',
      },
    }
  );

  let merged = [];

  await Promise.all(
    possiblePresentations.map(async presentation => {
      const isPresentation = []
        .concat(presentation.category)
        .some(category => category && category._.includes('Presentation'));

      if (isPresentation && presentation['wp:status'] === 'publish') {
        const author = presentation['dc:creator'];

        const tags = getTags(presentation);
        const meta = getMeta(presentation);

        const raw =
          presentation.content ||
          presentation['content:encoded'].replace(/\[\/?markdown\]/g, '');
        const {
          markdown,
          iframe,
          images,
          addjsReplacements,
        } = await toMarkdown(raw);

        merged.push({
          author: (authorsLookup[author] || { name: author }).name,
          category: 'presentation',
          raw,
          markdown,
          images,
          addjsReplacements,
          iframe: iframe,
          date: new Date(presentation.pubDate).toISOString(),
          link: presentation.link,
          slug: presentation['wp:post_name'],
          tags: Array.from(tags),
          title: presentation.title,
          ...(meta && Object.keys(meta).length > 0 ? { meta } : {}),
        });
      }
    })
  );

  return merged;
}
