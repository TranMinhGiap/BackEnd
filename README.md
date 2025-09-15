# Trong mongo có hỗ trợ tìm kiến theo chuỗi regex => có thể tìm kiếm chuỗi chứa từ nào chẳng hạn

# Khi load lại trang thì nó chỉ load lại url hiện tại thôi ~ nó gửi lại request chính bằng url hiện tại đến server để xử lại logic và trả về giao diện

# Router dộng ~ react-router-dom trong react js => tham số động sẽ thêm dấu : ở trước rồi khớp nó sẽ ánh xạ giá trị vào url

# Chức năng cập nhật trạng thái: ta dùng thẻ a và điền link /admin/product/change-status/active/1 cũng được nhưng mặc định nó là phương thức get vì hiển thị url trên trình duyệt nên ta không nên làm theo cách đó với chức năng update. Thì có 2 option thứ nhất là qua form (fomr giả) thứ 2 là call api. Trong form nếu có input nó cũng sẽ được nối vào query string nên req.params bên backend cũng sẽ nhận được

# File Pug sau khi biên dịch thực chất chỉ là HTML, nên bạn hoàn toàn có thể nhúng file JavaScript giống như trong HTML.

# req.params.name = "giap" là nó dựa vào url của trình duyệt bên phía client còn cái Backend pattern để giúp back end đối chiếu khớp thì nó sẽ chạy vào controller tương ứng để xử lý logic. Ví dụ http://localhost:3000/user/giap thì Express backend nhận request này, đem URL /user/giap đi so với pattern /user/:name. Nếu khớp, thì Express sẽ “giải” :name = giap → đưa vào req.params nghĩa là nó sẽ lấy tên tham số động và giá trị ánh xạ tương ứng để tạo thành key: value đặt trong 1 object và đưa vào req.params. Chú ý input chỉ gửi được string nên sang kia ta cần convert lại nếu là số, ...

# Ta có thể gửi dữ liệu sang backend bằng nhiều cách thứ nhất là truyền theo params (...?...). Thứ  là thông qua form nó lấy giá trị trong ô input + name thành object để gửi và req.params cũng nhận được. Cách thứ 3 là thông qua tham số động nó cũng tạo thành object trong params như form để xử lý thông tin