# 🌸 Thiệp Tri Ân Thầy Cô • Ngày Nhà Giáo Việt Nam 20/11 🌸

> Món quà tri ân ý nghĩa, tinh tế và tương tác sống động dành tặng Quý Thầy Cô nhân ngày Nhà giáo Việt Nam 20/11. Người nhận chỉ cần dùng camera điện thoại hoặc Zalo quét mã QR là có thể mở thiệp và thưởng thức trọn vẹn món quà!

---

## ✨ Điểm Nổi Bật Của Món Quà

1. **Hiệu ứng Mở Phong Bì 3D Sống Động:**
   - Phong bì đỏ đô viền vàng kim quý phái với con dấu sáp 20/11.
   - Khi chạm vào, phong bì mở nắp và bức thư tự động lướt ra mượt mà.
2. **Âm Nhạc Du Dương:**
   - Đĩa than cổ điển xoay tròn phát giai điệu piano nhẹ nhàng, êm dịu tri ân Thầy Cô (tích hợp trực tiếp qua Web Audio API, hoạt động 100% offline và không bao giờ bị lỗi link nhạc).
3. **Mưa Cánh Hoa & Bụi Phấn Rơi:**
   - Hiệu ứng cánh hoa phượng, hoa hồng và bụi phấn rơi lãng mạn trên toàn màn hình.
   - Nút **"Thả Hoa Tri Ân"** tạo pháo hoa cánh hoa rực rỡ kèm âm thanh chúc mừng rộn rã.
4. **Tùy Chọn Người Nhận & Tự Đổi Tên Người Gửi:**
   - Chọn nhanh đối tượng: *Quý Thầy Cô giáo*, *Thầy giáo*, *Cô giáo*, hoặc *Thầy/Cô Chủ nhiệm* — nội dung thư sẽ tự động chuyển đổi phù hợp và cảm động nhất.
   - Người gửi có thể bấm trực tiếp vào chữ ký để sửa thành tên mình hoặc tên tập thể lớp (tự động ghi nhớ).
5. **Bảng Đen Kỷ Niệm (Classroom Slate):**
   - Không gian bảng đen phấn trắng gợi nhớ về thời khóa biểu đạo làm người và những lời dặn dò bất hủ của Thầy Cô.
6. **Mã QR Tương Tác Sẵn Có:**
   - File vector SVG chất lượng cao (`qr-tri-an-20-11.svg`) có khung viền hoa văn vàng trang trọng, sẵn sàng in ra thiệp giấy hoặc gửi tặng qua tin nhắn.
   - Trình quét mã và tải ảnh PNG tích hợp ngay trong thiệp.

---

## 🚀 Hướng Dẫn Đẩy Lên Git & Bật Quét QR Trên Điện Thoại

Để Thầy Cô và bạn bè có thể quét mã QR từ bất kỳ đâu (Zalo, Camera iPhone/Android), bạn chỉ cần đưa trang web này lên **GitHub Pages** (hoàn toàn miễn phí) theo các bước đơn giản sau:

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên Repository là: `tri-an-20-11` (hoặc tên tùy thích).
3. Để ở chế độ **Public** (Công khai).
4. Nhấn nút **Create repository** (không cần tick chọn README).

### Bước 2: Đẩy mã nguồn lên GitHub
Mở PowerShell hoặc Terminal tại thư mục này và chạy các lệnh:

```bash
# 1. Thêm link remote GitHub của bạn (thay bằng URL repo của bạn)
git remote add origin https://github.com/taductoi1596-stack/tri-an-20-11.git

# 2. Đổi tên nhánh chính thành main hoặc master
git branch -M main

# 3. Đẩy toàn bộ code lên GitHub
git push -u origin main
```

### Bước 3: Bật GitHub Pages (Để tạo link quét trực tuyến)
1. Trên trang GitHub repository vừa tạo, vào mục **Settings** (Cài đặt) -> Chọn **Pages** (ở cột bên trái).
2. Tại mục **Branch**, chọn nhánh `main` (hoặc `master`), thư mục giữ nguyên `/(root)`.
3. Nhấn **Save**.
4. Chờ khoảng 1 - 2 phút, GitHub sẽ hiển thị đường link dạng:
   👉 `https://taductoi1596-stack.github.io/tri-an-20-11/`

### Bước 4: Cập nhật lại mã QR (Nếu cần)
Mã QR mặc định trong dự án đã được cài đặt sẵn đường link:
`https://taductoi1596-stack.github.io/tri-an-20-11/`

Nếu bạn đặt tên repo hoặc tài khoản khác, bạn chỉ cần chạy lệnh:
```bash
node generate-qr.js https://<tai-khoan-cua-ban>.github.io/<ten-repo>/
```
File `qr-tri-an-20-11.svg` sẽ tự động cập nhật ngay lập tức!

---

## 📁 Cấu Trúc Thư Mục

```text
tri-an-20-11/
├── index.html            # Giao diện chính của thiệp tương tác
├── style.css             # Thiết kế phong cách sang trọng, bảng đen, hiệu ứng 3D
├── script.js             # Logic âm thanh, mưa hoa, tương tác phong bì
├── qrcode.js             # Thư viện sinh mã QR thuần JS không phụ thuộc bên ngoài
├── generate-qr.js        # Script Node sinh khung ảnh mã QR SVG cao cấp
├── qr-tri-an-20-11.svg   # Ảnh mã QR viền vàng hoa văn để in hoặc gửi tặng
├── qr-preview.html       # Trang xem trước và tải nhanh mã QR
├── .nojekyll             # Cấu hình GitHub Pages
└── README.md             # Hướng dẫn chi tiết
```

---

❤️ **Kính chúc Quý Thầy Cô giáo một ngày 20/11 tràn ngập niềm vui, sức khỏe và hạnh phúc!**
