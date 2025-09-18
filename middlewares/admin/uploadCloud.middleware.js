const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});
// End cấu hình Cloudinary

module.exports.upload = (req, _, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      // console.log(result);
      req.body[req.file.fieldname] = result.secure_url;
      // Cập nhật luôn thumbnail luôn ở bước này bởi ở đây đang có url online sang controller thì không có hoặc phải truyền
      next();
      // Nếu có ảnh phải chờ upload xong mới cho chạy tiếp tránh chưa xong đã next thì chưa kịp upload để cập nhật thumbnail
    }
    // console.log(req);
    upload(req);
  } else {
    next();
    // Luôn cho qua khi có hoặc không có ảnh bởi ảnh có thể thêm sau
  }
}