// Update Cart
const inputsChangeQuantity = document.querySelectorAll("[input-change-quantity]");
if(inputsChangeQuantity.length > 0){
  inputsChangeQuantity.forEach(input => {
    input.addEventListener("change", (e) => {
      const quantity = parseInt(e.target.value);
      const productId = input.getAttribute("product-id");
      if(quantity > 0){
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    })
  })
}
// End Update Cart