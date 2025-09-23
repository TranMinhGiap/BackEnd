// Delete item
const buttonDelete = document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn xóa danh mục này không ?");
       if(isConfirm){
        const idCategory = button.getAttribute("data-id");
        const formDelete = document.querySelector("#form-delete-item");
        if(formDelete && idCategory){
          const action = formDelete.getAttribute("data-path");
          formDelete.action = `${action}/${idCategory}?_method=DELETE`
          formDelete.submit();
        }
       }
    })
  })
}
// End Delete item