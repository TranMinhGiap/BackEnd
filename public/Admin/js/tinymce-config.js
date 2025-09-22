tinymce.init({
  selector: 'textarea.tiny-mce',
  plugins: 'lists link image table code help wordcount',
  license_key: 'gpl',
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        // Tạo id cho blob
        var id = 'blobid' + (new Date()).getTime();

        // Lấy cache của TinyMCE
        var blobCache = tinymce.activeEditor.editorUpload.blobCache;

        // Đọc kết quả base64
        var base64 = reader.result.split(',')[1];

        // Tạo đối tượng blobInfo
        var blobInfo = blobCache.create(id, file, base64);

        // Add vào cache
        blobCache.add(blobInfo);

        // Chèn ảnh vào editor bằng blob URI
        cb(blobInfo.blobUri(), { title: file.name });
      };

      reader.readAsDataURL(file);
    };

    input.click();
  }
  // Nó lưu dưới dạng bit64/64bit kiểu mã hóa hiểu đó là url hình ảnh còn nó lưu ở đâu thì không biết
  // => cách khác là ta upload lên cloud như khi tạo mới sản phẩm và lấy cái link đó để preview cũng được
});