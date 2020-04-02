import * as _ from "lodash";

export const copyObject = (object: any): any => {
  if (!!!object) return object;
  return JSON.parse(JSON.stringify(object));
};

export const isEqual = (object1: any, object2: any) => {
  return _.isEqual(
    removeUndefinedFromObject(object1),
    removeUndefinedFromObject(object2)
  );
};

export const removeUndefinedFromObject = (object: any) => {
  _.each(object, (value, key) => {
    if (_.isUndefined(value)) {
      delete object[key];
    }
  });
  return object;
};
