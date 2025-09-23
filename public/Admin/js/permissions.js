// Permissions
const tablePermissions = document.querySelector("#table-permissions");
if(tablePermissions){
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");
    rows.forEach(row => {
      const name = row.getAttribute("data-name");
      const inputs = row.querySelectorAll("input");
      if(name === "id"){
        inputs.forEach(input => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: []
          })
        })
      }else{
        inputs.forEach((input, idx) => {  
          const checked = input.checked;
          if(checked){
            permissions[idx].permissions.push(name)
          }
        })
      }
    })
    // console.log(permissions);
    if(permissions.length > 0){
      const formChangePermissions = document.querySelector("#form-change-permissions");
      if(formChangePermissions){
        const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
        inputPermissions.value = JSON.stringify(permissions);
        // do input luu duoi dang chuoi ma kia la mang len can convert thanh chuoi
        formChangePermissions.submit();
      }
    }
  })
}
// End Permissions
// Show Value Checkbox
const dataRecords = document.querySelector("[data-records]");
if(dataRecords){
  const records = JSON.parse(dataRecords.getAttribute("data-records"));
  const tablePermissions = document.querySelector("#table-permissions");
  records.forEach((record, idx) => {
    const permissions = record.permissions;
    permissions.forEach(permission => {
      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);
      const input = row.querySelectorAll("input")[idx];
      input.checked = true;
    })
  })
}

// End Show Value Checkbox