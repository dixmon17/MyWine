export function objectLength(obj) {
  var result = 0;
  for(var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
    // or Object.prototype.hasOwnProperty.call(obj, prop)
      result++;
    }
  }
  return result;
}

export function renameProperty(datas, oldName, newName) {
  // Do nothing if the names are the same
  if (oldName === newName) {
     return datas;
  }

  for (let data of datas) {
    // Check for the old property name to avoid a ReferenceError in strict mode.
    if (data.hasOwnProperty(oldName)) {
        data[newName] = data[oldName];
        delete data[oldName];
    }
  }
  return datas;
}

export function pushObject(data) {
  var tempData = [];
  for ( var index=0; index<data.length; index++ ) {
      if ( data[index].Status == "Valid" ) {
          tempData.push( data );
      }
  }
  return tempData;
}

export function makeUniq(object) {
  let uniq = new Set(object)
  return Array.from(uniq)
}

export function sort(data, key, order = 'asc') {
  var t = function innerSort(a, b) {
    if (!a) return 0
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };

  return data.sort(t)
}

export function removeAccent(string) {
  var map = {
      '-' : ' ',
      '-' : '_',
      'a' : 'á|à|ã|â|À|Á|Ã|Â',
      'e' : 'é|è|ê|É|È|Ê',
      'i' : 'í|ì|î|Í|Ì|Î',
      'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
      'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
      'c' : 'ç|Ç',
      'n' : 'ñ|Ñ'
  };

  for (var pattern in map) {
      string = string.replace(new RegExp(map[pattern], 'g'), pattern);
  };

  return string
}
