module.exports.priceNewProducts = (products) => {
  const newProduct = products.map(item => {
    item.priceNew = (item.price * (1 - item.discountPercentage / 100)).toFixed(2);
    return item;
  })
  return newProduct;
}
module.exports.priceNewProduct = (product) => {
  const priceNew = (product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  return priceNew;
}