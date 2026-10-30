# IdeaBurst Flowers

Shop hoa cao cấp ở Kalispell, Montana. Next.js 16, Stripe (gồm gói định kỳ). Deploy chính: Hostinger Node.js Web App; dự phòng: `npm run build:static` + PHP qua FTP.

Build: `npm run build` · Nhánh làm việc: `main` · Trả lời chủ shop bằng tiếng Việt.

## Luật cốt lõi
- Hai cách deploy dùng chung `/api/checkout.php` và `/api/inquiry.php`: sửa API thì sửa cả `src/server/*` lẫn `hosting/static/api/*.php`.
- Giá luôn tính lại phía server từ `catalog.json`.
- Dependabot tự merge vào `main`: luôn `git pull` trước khi làm và trước khi push.

## Luồng làm việc
Mỗi việc một session ngắn, mở bằng lệnh luồng: `/cua-hang`, `/seo`. Bảng phạm vi: `docs/luong/README.md`.
- Chỉ sửa file thuộc luồng mình. Việc của luồng khác: ghi sang sổ luồng đó với tiền tố `[từ <luồng>]`.
- Quên mở bằng lệnh luồng: hỏi chủ shop việc này thuộc luồng nào. Việc vặt 1 dòng thì làm thẳng, không cần đọc sổ.
- Sổ `docs/luong/<luồng>.md` có đúng 4 mục, giữ dưới 120 dòng. Quyết định đã chốt không được làm ngược khi chủ shop chưa đồng ý.

## Ship
- Xong mỗi việc: `npm run build` không lỗi, rồi trong CÙNG commit ghi sổ luồng: thêm 1 dòng Nhật ký (mới nhất ở trên); cập nhật Trạng thái, Quyết định đã chốt, Việc cần làm tiếp; sửa CLAUDE.md nếu thay đổi làm nó sai.
- Nhật ký quá 30 dòng: dời phần cũ sang `docs/luong/luu-tru/<luồng>-YYYY-MM.md`.
- Push lên `main`. Bị từ chối: `git pull --rebase` rồi push lại. Không bao giờ `push --force`.
- Kết thúc bằng đúng 1 dòng: "Đã push + đã ghi sổ <luồng>. Có thể đóng luồng."
- `/xong` chỉ dùng khi việc bị dừng giữa chừng chưa push.
