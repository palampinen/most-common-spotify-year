import { List, fromJS } from 'immutable';
import _uniqBy from 'lodash/uniqBy';

// Immutable uniqBy (using lodash)
export const uniqBy = (list, key) => {
  const isValidList = List.isList(list);

  if (!isValidList || list.isEmpty()) {
    return List();
  }

  return fromJS(_uniqBy(list.toJS(), key));
};
