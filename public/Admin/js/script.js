// ==================== Loc san pham theo trang thai admin ===============
const buttonsStatus = document.querySelectorAll("[button-status]");
// Thuộc tính do ta tự định nghĩa thì phải thêm dấu [] bao bọc

if(buttonsStatus.length > 0){
  let url = new URL(window.location.href);
  buttonsStatus.forEach(button => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");
      if(status){
        url.searchParams.set("status", status);
      }
      else{
        url.searchParams.delete("status");
      }
      // console.log(url);
      window.location.href = url.href;
    })
  })
}
// ==================== Loc san pham theo trang thai admin ===============
// ==================== tim san pham  admin ===============
const formSearch = document.querySelector("#form-search");
if(formSearch){
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const valueSearch = e.target.elements.keyword.value;
    console.log(valueSearch);
    if(valueSearch){
      url.searchParams.set("keyword", valueSearch);
    }
    else{
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  })
}
// ==================== tim san pham  admin ===============

// ==================== Pagination admin ===============
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
  let url = new URL(window.location.href);
  buttonsPagination.forEach(button => {
    button.addEventListener("click", () => {
      const pageActive = button.getAttribute("button-pagination");
      if(pageActive){
        url.searchParams.set("page", pageActive);
        window.location.href = url.href;
      }
    })
  })
}
// ==================== Pagination admin ===============

// ==================== Preview Image ===============
const uploadImage = document.querySelector("[upload-image]")
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if(file){
      uploadImagePreview.src = URL.createObjectURL(file)
    }
  })
}
// ==================== End Preview Image ===============
