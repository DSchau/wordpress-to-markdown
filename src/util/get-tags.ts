export function getTags(
  item: any,
  exclude = ['blog', 'presentation']
): Set<string> {
  return new Set(
    []
      .concat(item.category || [])
      .map(tag => (tag.$.nicename || '').toLowerCase())
      .filter(tag => tag && !exclude.includes(tag))
  );
}
