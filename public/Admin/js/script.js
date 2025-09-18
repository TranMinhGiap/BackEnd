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

// ==================== Sort ===============
// Định nghĩa thuộc tính sort mục đích để xem có thì mới xử lý logic không có thì thôi => như cái cờ gắn vào đó
const sort = document.querySelector("[sort]");
if(sort){
  let url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  sortSelect.addEventListener("change", (e) => {
    const [sortKey, sortValue] = e.target.value.split("-");
    // Biết chắc chắn thằng đầu là key thằng 2 là value => destructuring
    if(sortKey && sortValue){
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);
      window.location.href = url.href;
    }
  })
  // Xóa sắp xếp
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  })
  // Thêm selected cho option của selected
  const sortKey = url.searchParams.get("sortKey");
  const sortValue= url.searchParams.get("sortValue");
  if(sortKey && sortValue){
    sortSelect.value = `${sortKey}-${sortValue}`;
    // hoặc nối nỗi chuỗi rồi tìm option có value tương ứng rồi thêm thuộc tính selected = true cũng được
  }
  // End thêm selected cho option của selected
}
// ==================== End Sort ===============


