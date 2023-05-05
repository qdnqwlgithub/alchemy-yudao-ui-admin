// todo

import _ from "lodash";
import { debug } from 'script-ext-html-webpack-plugin/lib/common'

export function convert2Entity(item, fieldArray){
  item= _.cloneDeep(item);
  for (let itemKey in item) {
    if(fieldArray.includes(itemKey)){
      item[itemKey]=JSON.stringify(item[itemKey]);
    }
  }
  return item;
}

export function convert2Vo(entity,fieldArray){
  entity= _.cloneDeep(JSON.parse(item));
  for (let itemKey in item) {
    if(fieldArray.includes(itemKey)){
      item[itemKey]=JSON.parse(item[itemKey]);
    }
  }
  return entity;
}







