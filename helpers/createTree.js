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

// module.exports.flattenTree = (tree, level = 0, prefix = "") => {
//   let result = [];
//   tree.forEach(item => {
//     result.push({
//       ...item,
//       prefix: "-- ".repeat(level)  // để hiển thị
//     });
//     if (item.children) {
//       result = result.concat(flattenTree(item.children, level + 1));
//     }
//   });
//   return result;
// }
// Chuyen thanh mang nhu nay thi khi duoi pug se do phai xu ly logic hon chi can duyet qua moi phan tu roi td #{item.prefix} #{item.title}