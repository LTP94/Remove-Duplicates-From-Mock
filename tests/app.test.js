const fs = require('fs');

process.argv = ['node', 'jest', 'test_mock_application.json'];

const getDuplicates = require('../utils/index').getDuplicates;
const getMostRecent = require('../utils/index').getMostRecent;
const filterDataByMatchingKeys = require('../utils/index').filterDataByMatchingKeys;
const removeIdenticals = require('../utils/index').removeIdenticals;
const keepUniqueValuesOneArr = require('../utils/index').keepUniqueValuesOneArr;

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
        expect(idDupes.length).toBe(4);
        
      });

      it('.nonDupes should return 2  with unique _id ', () => {
        const idNonDupes = getDuplicates(data.versions[0].scenes[0].views, '_id').nonDupes;
        expect(totalViews - 4).toBe(0);
      });
  });

});


describe('getMostRecent', () => {

  describe('keyDupes', () => {

    const fieldsKeyDupes = getDuplicates(data.versions[0].scenes[0].views, 'key');

    const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, 'key');

    it('should return 1 view (only 1 element dupe) on the first scene', () => {
      expect(fieldsKeyDuplicatesToKeep.length).toBe(2);
    });
  });

});

describe('removeIdenticals', () => {

  const fieldsKeyDupes = getDuplicates(data.versions[0].scenes[0].views, 'key');
  const fieldsIDDupes = getDuplicates(data.versions[0].scenes[0].views, '_id');

  const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, 'key');
  const fieldsIDDuplicatesToKeep = getMostRecent(fieldsIDDupes.dupes, '_id');

  const finalDuplicatesToKeep = removeIdenticals(fieldsKeyDuplicatesToKeep, fieldsIDDuplicatesToKeep);

  it('contains 1 final view from duplicates', () => {
    expect(finalDuplicatesToKeep.length).toBe(2);
  });

  it('finalDuplicatesToKeep does not contain view with name: `Menu` more than once', () => {

    const finalDupesToKeep = finalDuplicatesToKeep.filter(item => item.name === 'Menu');

    expect(finalDupesToKeep.length).toBe(1)
  });


});

describe('keepUniqueValuesOneArr', () => {

  const fieldsKeyDupes = getDuplicates(data.versions[0].scenes[0].views, 'key');
  const fieldsIDDupes = getDuplicates(data.versions[0].scenes[0].views, '_id');

  const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, 'key');
  const fieldsIDDuplicatesToKeep = getMostRecent(fieldsIDDupes.dupes, '_id');

  const finalDuplicatesToKeep = removeIdenticals(fieldsKeyDuplicatesToKeep, fieldsIDDuplicatesToKeep);

  const matchingKeys = finalDuplicatesToKeep.map(item => {
    return item.key
  });
  const matchingIds = finalDuplicatesToKeep.map(item => {
    return item._id
  });

  const matchingKeysToRemove = [...matchingIds, ...matchingKeys];

  const filteredData = filterDataByMatchingKeys(data.versions[0].scenes[0].views, matchingKeysToRemove);

  const finalSanitizedArr = [...filteredData.newData, ...finalDuplicatesToKeep];

  console.log(finalSanitizedArr);
  console.log(filteredData);


  it('finalSanitizedArr should only keep 2 unique values ', () => {

    expect(finalSanitizedArr.length).toBe(2);

  });

  it('filteredData should return 4 values ', () => {
    expect(filteredData.toRemove.length).toBe(4);
  });

  it('matchingKeysToRemove should return two ids 61e86a5d1137bc002545ff11 and 61e86a411137bc002545ff0e ', () => {
    expect(matchingKeysToRemove[0]).toStrictEqual('61e86a5d1137bc002545ff11');
    expect(matchingKeysToRemove[1]).toStrictEqual('61e86a411137bc002545ff0e');
  });

});
