// Delete item
const buttonDelete = document.querySelectorAll("[button-delete-role]");
if(buttonDelete.length > 0){
  buttonDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Bạn có muốn xóa nhóm quyền này không ?");
      if (isConfirm) {
        const idRole = button.getAttribute("data-id");
        const formDelete = document.querySelector("#form-delete-item");
        if (formDelete) {
          const action = formDelete.getAttribute("data-path");
          formDelete.action = `${action}/${idRole}?_method=DELETE`;
          formDelete.submit();
        }
      }
    })
  })
}
// End Delete item
