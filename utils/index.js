/**
 * returns all  duplicates at a given key
 * 
 * @param arr {array} - array of objects
 * @param key  {string}  - 'key' or 'id'
 * 
 * @returns {array} - dupes (duplicates) and nonDupes (not Duplicate)
 **/

 const getDuplicates = (arr, key) => {
    let dupes = [];
    let nonDupes = [];
  
    let dupeTracker = {};

    arr.forEach(item => {
      if (dupeTracker.hasOwnProperty(item[key])) {
        if (dupeTracker[item[key]] !== 'dupe') {
          dupeTracker[item[key]] = 'dupe';
        }
      } else {
        dupeTracker[item[key]] = 'unique';
      }
    });
    const dupeKeys = Object.keys(dupeTracker).filter(key => {
      return dupeTracker[key] === 'dupe'
    });
    arr.forEach(item => {
      if (dupeKeys.includes(item[key])) {
        dupes.push(item)
      } else {
        nonDupes.push(item);
      }
    });
    return {
      dupes,
      nonDupes
    };
  }

/**
 *  Iterates over an array of duplicate objects and returns an array with one of them, or if tied, the last in list
 * 
 * @param dataArr {array}  - array of objects (fields) or scenes (views)
 * @param key {string}  - 'key' or '_id'

 * @returns {array} 
 */
  
  const getMostRecent = (dataArr, key) => {
    return Object.values(dataArr.reduce((unique, obj) => {
      if (!unique[obj[key]]) {
        unique[obj[key]] = obj
      }
      return unique;
    }, {}));
  }
  
/**
* combines both arrays and removes identical 
* 
* @param firstArr {array}  
 * @param secondArr {array}  
 * 
 * @returns {array}
 */
  
     const removeIdenticals = (firstArr, secondArr) => {
        const allDupes = [...firstArr, ...secondArr];
        return allDupes.filter((item, index, arr) => {
          return arr.indexOf(item) === index;
        })
      }

/**
 * uses matchingKeysToRemove to get the data to keep from original 
 * and gets the data to be removed from original (toRemove)
 * 
 * @param dataArr {array}  
 * 
 * @param matchingKeysToRemove {array} - keys that will be removed
 * 
 * @returns {object} 
 */

const filterDataByMatchingKeys = (dataArr, matchingKeysToRemove) => {
    let toRemove = [];
    let newData = dataArr.slice();
    for (let i = dataArr.length - 1; i >= 0; i--) {
      if (matchingKeysToRemove.includes(dataArr[i]._id) || matchingKeysToRemove.includes(dataArr[i].key)) {
        toRemove.push(dataArr[i])
        newData.splice(i, 1);
      } 
    }
    return {
      newData,
      toRemove
    };
  }

  /**
 * 
 * returns a sanitized array with unique values checked by the given keys
 * 
 * @param arr {array}  
 * 
 * @param firstKey {string} - first key that will be checked
 * 
 * @param secondKey {string} - second key that will be checked
 * 
 * @returns {object} 
 */
  
  const keepUniqueValuesOneArr = (arr , firstKey, secondKey) => {

    const fieldsKeyDupes = getDuplicates(arr, firstKey);
    const fieldsIDDupes = getDuplicates(arr, secondKey);

    const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, firstKey);
    const fieldsIDDuplicatesToKeep = getMostRecent(fieldsIDDupes.dupes, secondKey);

    const finalDuplicatesToKeep = removeIdenticals(fieldsKeyDuplicatesToKeep, fieldsIDDuplicatesToKeep);

    const matchingKeys = finalDuplicatesToKeep.map(item => {
      return item.key
    });
    const matchingIds = finalDuplicatesToKeep.map(item => {
      return item._id
    });

    const matchingKeysToRemove = [...matchingIds, ...matchingKeys];

    console.log(matchingKeysToRemove);

    const filteredData = filterDataByMatchingKeys(arr, matchingKeysToRemove);

    const finalSanitizedArr = [...filteredData.newData, ...finalDuplicatesToKeep];

   return finalSanitizedArr;

  }

  /**
 * 
 * sanitizes multiple arrays by a given object path.
 * 
 * @param arr {array}  
 * 
 *  @param path {string}  
 * 
 * @param firstKey {string} - first key that will be checked
 * 
 * @param secondKey {string} - second key that will be checked
 * 
 * @returns {object} 
 */

  function keepUniqueValues(arr, path, firstKey, secondKey) {
    
    for (let i = 0; i <  arr.length; i++) {
  
      const fieldsKeyDupes = getDuplicates(arr[i][path], firstKey);
      const fieldsIDDupes = getDuplicates(arr[i][path], secondKey);
  
      const fieldsKeyDuplicatesToKeep = getMostRecent(fieldsKeyDupes.dupes, firstKey);
      const fieldsIDDuplicatesToKeep = getMostRecent(fieldsIDDupes.dupes, secondKey);
  
      const finalDuplicatesToKeep = removeIdenticals(fieldsKeyDuplicatesToKeep, fieldsIDDuplicatesToKeep);
  
      const matchingKeys = finalDuplicatesToKeep.map(item => {
        return item.key
      });
      const matchingIds = finalDuplicatesToKeep.map(item => {
        return item._id
      });
  
      const matchingKeysToRemove = [...matchingIds, ...matchingKeys];

      console.log(matchingKeysToRemove);

      const filteredData = filterDataByMatchingKeys(arr[i][path], matchingKeysToRemove);

      const finalSanitizedArr = [...filteredData.newData, ...finalDuplicatesToKeep];

      arr[i][path] = finalSanitizedArr;
  
    }
  }

  module.exports = {
    getDuplicates,
    getMostRecent,
    removeIdenticals,
    filterDataByMatchingKeys,
    keepUniqueValues,
    keepUniqueValuesOneArr
  };
