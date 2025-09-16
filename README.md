# Trong mongo có hỗ trợ tìm kiến theo chuỗi regex => có thể tìm kiếm chuỗi chứa từ nào chẳng hạn

# Khi load lại trang thì nó chỉ load lại url hiện tại thôi ~ nó gửi lại request chính bằng url hiện tại đến server để xử lại logic và trả về giao diện

# Router dộng ~ react-router-dom trong react js => tham số động sẽ thêm dấu : ở trước rồi khớp nó sẽ ánh xạ giá trị vào url

# Chức năng cập nhật trạng thái: ta dùng thẻ a và điền link /admin/product/change-status/active/1 cũng được nhưng mặc định nó là phương thức get vì hiển thị url trên trình duyệt nên ta không nên làm theo cách đó với chức năng update. Thì có 2 option thứ nhất là qua form (fomr giả) thứ 2 là call api. Trong form nếu có input nó cũng sẽ được nối vào query string nên req.params bên backend cũng sẽ nhận được

# File Pug sau khi biên dịch thực chất chỉ là HTML, nên bạn hoàn toàn có thể nhúng file JavaScript giống như trong HTML.

# req.params.name = "giap" là nó dựa vào url của trình duyệt bên phía client còn cái Backend pattern để giúp back end đối chiếu khớp thì nó sẽ chạy vào controller tương ứng để xử lý logic. Ví dụ http://localhost:3000/user/giap thì Express backend nhận request này, đem URL /user/giap đi so với pattern /user/:name. Nếu khớp, thì Express sẽ “giải” :name = giap → đưa vào req.params nghĩa là nó sẽ lấy tên tham số động và giá trị ánh xạ tương ứng để tạo thành key: value đặt trong 1 object và đưa vào req.params. Chú ý input chỉ gửi được string nên sang kia ta cần convert lại nếu là số, ...

# Ta có thể gửi dữ liệu sang backend bằng nhiều cách thứ nhất là truyền theo params (...?...). Thứ  là thông qua form nó lấy giá trị trong ô input + name thành object để gửi và req.params cũng nhận được. Cách thứ 3 là thông qua tham số động nó cũng tạo thành object trong params như form để xử lý thông tin

# Schema hiểu chỉ là cái modal (khuân) để làm việc với 1 collection (table) cụ thể thôi, kiểu nó giông giống ánh xá ý. Nó ánh xạ thuộc tính vào modal. => Giả sử schema có thuộc tính mà db không có thì khi lấy thì thuộc tính không có thì thuộc tính đó trong schema sẽ là undefine, update nếu field có trong schema nhưng DB document chưa có → MongoDB sẽ thêm field đó vào document. Create cũng như update không có sẽ thêm vào và ngược lại schema không có những trường mà db có. Cụ thể khi đọc thì nó chỉ đọc những trường được định nghĩa trong schema (Nghĩa là schema quyết định bạn thấy field nào). Create nếu ta truyền 1 trường mà không được định nghĩa trong schema thì nó cũng sẽ không chấp nhận và bỏ trường đó ra, Update cũng thế chỉ update những trường có trong schema. Nhưng nếu bạn muốn lưu cả field ngoài schema có thể bật strict: { strict: false } false trong schema: Khi đó, Mongoose sẽ không bỏ qua và lưu luôn các field không có trong schema.

# Không làm tính năng hiển thị thông báo khi thực hiện hành động thành công, hình như lỗi thư viện hay sao ấy nên không muốn làm. Logic của nó cũng đơn giản thành công thì gửi message ra fe và css lại để nó hiển thị và tắt mượt hơn. Ta nên dùng thư viện của FE như antd, bootrap thì hơn nhưng đây là server side nên ta phải tìm thư viện khác cái trên hình như bị lỗi

# Tạo 1 thuộc tính nhằm mục đích tái sử dụng như class trong css ấy thêm thuộc tính vào chỗ cần thì nó sẽ có tác dụng