const matter = require('gray-matter');
const path = require('path');
const fs = require('fs');

// relative path from the root directory
const textDir = 'txt/';

module.exports = function() {
  const docs = [];

  fs.readdir(textDir, (err, files) => {
    if (err) throw err;

    files.forEach(file => {
      const filePath = path.join(textDir, file);

      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        const doc = matter(data);
        doc.slug = file.split('.')[0];
        docs.push(doc);
      });
    });
  });

  return docs;
}
