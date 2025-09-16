// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path")

  // Lấy url hiện tại nhằm mục đích khi update xong thì trở lại url hiện tại do res.redirect("back") không được
  // const currentUrl = window.location.href;

  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {
      const statusCurrent = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let statusChange = statusCurrent == "active" ? "inactive" : "active";

      // console.log(statusCurrent);
      // console.log(id);
      // console.log(statusChange);

      const action = path + `/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action=action;
      // form.setAttribute("action", "/change-status/inactive/456"); như này gán lại giá trị thuộc tính được nhưng dùng cho thuộc tính tự định nghĩa còn thuộc tính có sẵn / định nghĩa sẵn của form thì dùng . cũng được
      
      // Thêm input ẩn để gửi URL hiện tại
      // const input = document.createElement("input");
      // input.type = "hidden";
      // input.name = "redirectUrl";
      // input.value = currentUrl;
      // formChangeStatus.appendChild(input);
      
      formChangeStatus.submit();
    });
  });
}
// End Change Status

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
        // Thuộc tính có sẵn mặc định thì không cần getAttribute("value");
        if(typeChange === "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${inputId}-${position}`);
          // Nếu là change-position thì ta nối thêm vị trí vào id của sản phẩm (inputId đã lưu id của sản phẩm) 
        }
        else{
          ids.push(inputId);
        }
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

// Delete Product
const buttonsDelete = document.querySelectorAll("[button-delete]");
buttonsDelete.forEach(button => {
  button.addEventListener('click', () => {
    const isConfirm = confirm("Bạn có muốn xóa sản phẩm này không !");
    if(isConfirm){
      const idProductDelete = button.getAttribute("data-id");
      const formDelete = document.querySelector("#form-delete-item");
      const action = formDelete.getAttribute("data-path");
      formDelete.action = action + `/${idProductDelete}?_method=DELETE`;
      formDelete.submit();  
    }
  })
})
// Endl Delete Product