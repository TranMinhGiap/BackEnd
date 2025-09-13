const buttonsStatus = document.querySelectorAll("[button-status]");
// Thuộc tính do ta tự định nghĩa thì phải thêm dấu [] bao bọc

let url = new URL(window.location.href);

if(buttonsStatus.length > 0){
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