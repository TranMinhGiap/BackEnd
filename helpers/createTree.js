let count = 0;
const createTree = (arr, parentId = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      count ++;
      const newItem = item;
      newItem.index = count;
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
}

module.exports.createTree = (arr, parentId = "") => {
  count = 0;
  // Khi load lai thi reset count != khoi dong lai server thi no moi chay lai tu dau
  const tree = createTree(arr, parentId = "");
  return tree;
}