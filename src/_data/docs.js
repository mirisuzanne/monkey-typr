import matter from 'gray-matter';
import { join } from 'path';
import { readdir, readFile } from 'node:fs/promises';

// relative path from the root directory
const textDir = './txt/';

export default async () => {
  const files = await readdir(textDir);
  const docs = [];

  for (let index = 0; index < files.length; index++) {
    const file = files[index];

    const filePath = join(textDir, file);
    const data = await readFile(filePath, { encoding: 'utf8' });
    const doc = matter(data);

    doc.slug = file.split('.')[0];
    doc.content = doc.content.replace('	', '    ').trim();
    doc.chars = doc.content.length;

    docs.push(doc);
  }

  return docs;
}
