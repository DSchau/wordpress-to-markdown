# wordpress-to-markdown

A Node utility to convert exported Wordpress XML to Markdown

## Usage

- Clone this repo
- Run `yarn` or `npm install` to install dependencies
- Export the XML file from wordpress, and overwrite `input/export.xml`.
- Run `yarn build` or `npm run build` which will run the script and export to `output`

## Notes

- This is fairly specific and tailored to a specific structure and Wordpress plugins; it's _highly_ possible tweaking will be required to get things _just_ right for your setup
- Treat this like a base to build upon and iterate, not a reference for a fully working out of the box experience
