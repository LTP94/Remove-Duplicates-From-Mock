const fs = require('fs');
const { keepUniqueValues, keepUniqueValuesOneArr } = require('./utils/index')

let data;

const filename = process.argv[2];

try {
  data = JSON.parse(fs.readFileSync(filename, 'utf8'));
} catch (e) {
  console.log('Error:', e.stack);
}


keepUniqueValues(data.versions[0].objects, 'fields', 'key', '_id');
keepUniqueValues(data.versions[0].scenes, 'views', 'key', '_id');

data.versions[0].objects = keepUniqueValuesOneArr(data.versions[0].objects, 'key', '_id');
data.versions[0].scenes = keepUniqueValuesOneArr(data.versions[0].scenes, 'key', '_id');

fs.writeFile('clean_application.json', JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log('File is created successfully.');
});
