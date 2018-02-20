export function getMeta(item: Object) {
  return [].concat(item['wp:postmeta'] || []).reduce((merged, tag) => {
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
}
