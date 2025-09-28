const Account = require("../models/account.modal");

module.exports = async (record) => {
  // ===================== User create =====================
  const idUserCreate = record?.createdBy?.account_id;
  if (idUserCreate) {
    const user = await Account.findOne({ _id: idUserCreate, deleted: false }).select("fullName");
    record.userName = user ? user.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
    record.date = record.createdBy?.createdAt || null;
  } else {
    record.userName = "Không xác định";
    record.date = null;
  }

  // ===================== User delete =====================
  const idUserDelete = record?.deletedBy?.account_id;
  if (idUserDelete) {
    const userDelete = await Account.findOne({ _id: idUserDelete, deleted: false }).select("fullName");
    record.userNameDelete = userDelete ? userDelete.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
    record.dateDelete = record.deletedBy?.deletedAt || null;
  } else {
    record.userNameDelete = "Chưa xóa";
    record.dateDelete = null;
  }

  // ===================== User last update =====================
  if (record?.updatedBy?.length > 0) {
    const userLastUpdate = record.updatedBy[record.updatedBy.length - 1]; 
    if (userLastUpdate?.account_id) {
      const user = await Account.findOne(
        { _id: userLastUpdate.account_id, deleted: false }
      ).select("fullName");

      record.lastUpdateUserName = user ? user.fullName : "Tài khoản đã bị xóa hoặc không tồn tại";
      record.lastUpdateDate = userLastUpdate.updatedAt || null;
    } else {
      record.lastUpdateUserName = "Không xác định";
      record.lastUpdateDate = null;
    }
  } else {
    // Nếu chưa có ai cập nhật
    record.lastUpdateUserName = "Chưa có ai cập nhật";
    record.lastUpdateDate = null;
  }
  return record;
};
