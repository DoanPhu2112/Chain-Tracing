import mung from 'express-mung';
import snakecaseKeys from 'snakecase-keys';

function sortObject(obj: object) {
  return Object.keys(obj).
    sort().
    reduce((result: object, key) => {
      (result as Record<string, any>)[key] = (obj as Record<string, any>)[key];
      return result
    }, {})
}

function transformObjectId(object: unknown) {
  if (typeof (object) !== 'object') return {};
  if (object === null) return {};

  if (object.hasOwnProperty('_doc')) {
    return transformObjectId(object);
  }
  if (object.hasOwnProperty('_bsontype') && object['_bsontype' as keyof object] === 'ObjectID') {
    return object.toString();
  }
  Object.keys(object).forEach((key) => {
    (object as Record<string, any>)[key] = transformObjectId((object as Record<string, any>)[key])
  })

  if (Array.isArray(object)) return object;
  if (Object.prototype.toString.call(object) === '[object Date]') return object;

  return sortObject(object)
}

function snakecaseRes() {

  return mung.json((body, req, res) => {
    return snakecaseKeys(transformObjectId(body), {
      deep: true
    })
  })
  
}

export default snakecaseRes;