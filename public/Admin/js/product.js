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