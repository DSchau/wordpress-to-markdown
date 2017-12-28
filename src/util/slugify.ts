import * as slug from 'slug';

export const slugify = str => slug(str).toLowerCase();
