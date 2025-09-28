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
// CheckBox
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']")
  
  inputCheckAll.addEventListener('click', () => {
    if(inputCheckAll.checked){
      inputsId.forEach(input => {
        input.checked = true
      });
    }
    else{
      inputsId.forEach(input => {
        input.checked = false
      });
    }
  })
  inputsId.forEach(input => {
    input.addEventListener('click', () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
      if(countChecked === inputsId.length){
        inputCheckAll.checked = true;
      }
      else{
        inputCheckAll.checked = false;
      }
    })
  })
}
// End CheckBox

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();
    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputChecked  = checkboxMulti.querySelectorAll("input[name='id']:checked");

    const typeChange = e.target.elements.type.value;
    if(typeChange === "deleted-all"){
      const isConfirm = confirm("Bạn có muốn xóa những sản phẩm đã chọn ?");
      if(!isConfirm){
        return;
      }
    }
    else if(typeChange === ""){
      alert("Vui lòng chọn hành động");
      return;
    }
    if(inputChecked.length > 0){
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputChecked.forEach(input => {
        const inputId = input.value;
        ids.push(inputId);
      })
      inputIds.value = ids.join(", ");
      formChangeMulti.submit();
    }
    else{
      alert("Chon it nhat 1 ban ghi")
    }
  })
}
// End Form Change Multi
