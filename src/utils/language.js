// todo

import _ from "lodash";

export function convert2Real(item, fieldArray){
  item= _.cloneDeep(item);
  for (let itemKey in item) {
    if(fieldArray.includes(itemKey)){
      item[itemKey]=JSON.stringify(item[itemKey]);
    }
  }
  return item;
}

export function convert2Table(item,fieldArray){
  item= _.cloneDeep(item);
  for (let itemKey in item) {
    if(fieldArray.includes(itemKey)){
      item[itemKey]=JSON.parse(item[itemKey]);
    }
  }
  return item;
}





