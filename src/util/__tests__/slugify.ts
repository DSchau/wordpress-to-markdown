import { slugify } from '../slugify';

test('it slugifies a name', () => {
  expect(slugify('Albert Einstein')).toBe('albert-einstein');
});

test('it slugifies a title', () => {
  expect(
    slugify(
      'Use a Terraform wrapper script to easily manage Terraform installations'
    )
  ).toBe(
    'use-a-terraform-wrapper-script-to-easily-manage-terraform-installations'
  );
});

test('it lower cases input', () => {
  expect(slugify('ALBERT EINSTEIN')).toBe('albert-einstein');
});
