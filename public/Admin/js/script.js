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
// ==================== tim pham  admin ===============
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
// ==================== tim pham  admin ===============