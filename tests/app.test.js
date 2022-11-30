const fs = require('fs');

process.argv = ['node', 'jest', 'test_mock_application.json'];

const getDuplicates = require('../utils/index').getDuplicates;
const getMostRecent = require('../utils/index').getMostRecent;
const removeIdenticals = require('../utils/index').removeIdenticals;

const filename = process.argv[2];

try {
  data = JSON.parse(fs.readFileSync(filename, 'utf8'));
} catch (e) {
  console.log('Error:', e.stack);
}

describe('getDuplicates', () => {

  let totalViews = data.versions[0].scenes[0].views.length;

  describe('_id', () => {
    it('.dupes should return 2  with dupe _ids from test_mock', () => {
        const idDupes = getDuplicates(data.versions[0].scenes[0].views, '_id').dupes;
        expect(idDupes.length).toBe(2);
        
      });

      it('.nonDupes should return 2  with unique _id ', () => {
        const idNonDupes = getDuplicates(data.versions[0].scenes[0].views, '_id').nonDupes;
        expect(totalViews - 2).toBe(0);
        // console.log(emailNonDupes)
      });
  });

});


describe('getMostRecent', () => {

  describe('keyDupes', () => {

    const fieldsKeyDupes = getDuplicates(data.versions[0].scenes[0].views, 'key');

    const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, 'key');

    console.log(fieldsKeyDuplicatesToKeep);

    it('should return 1 view (only 1 element dupe) on the first scene', () => {
      expect(fieldsKeyDuplicatesToKeep.length).toBe(1);
    });
  });

});
