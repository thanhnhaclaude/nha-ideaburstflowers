# IdeaBurst Flowers — Website

Website thương mại điện tử cao cấp cho **IdeaBurst Flowers** (Kalispell, Montana).
Next.js 16, một mã nguồn deploy được theo **2 cách**:

| | **A. Hostinger Node.js Web App** (đang dùng) | **B. Tĩnh + PHP qua FTP** (dự phòng) |
|---|---|---|
| Lệnh build | `npm run build` → `npm start` | `npm run build:static` → thư mục `out/` |
| Thanh toán, form | API Next.js (`src/server/*`) | PHP (`hosting/static/api/*.php`) |
| Cấu hình bí mật | Biến môi trường trên Hostinger | `~/ideaburst-config.php` |

Cả hai đều dùng chung đường dẫn `/api/checkout.php` và `/api/inquiry.php`, nên giao diện không phải đổi gì.

## Tính năng

- 46 trang, đã tối ưu SEO: metadata, Open Graph, sitemap, robots, JSON-LD (Florist, Product, FAQ, BlogPosting)
- Shop, 6 bộ sưu tập, 16 sản phẩm, quà tặng kèm (add-on)
- Giỏ hàng lưu trên trình duyệt, drawer, trang giỏ hàng gồm ZIP, ngày giao, người nhận, lời nhắn thiệp
- **Stripe Checkout** (thẻ, Apple Pay, Google Pay). Giá luôn được tính lại phía server từ `catalog.json`
- Gói hoa định kỳ (Stripe subscription): 3 cỡ × 3 tần suất, có giảm giá
- Kiểm tra vùng giao hàng theo ZIP, 3 vùng phí, chặn giờ same-day lúc 2 PM giờ Mountain
- Trang Cưới & Sự kiện kèm form tư vấn; Liên hệ; Newsletter; form thu đánh giá khách hàng
- Journal/blog (4 bài), FAQ, chính sách (Freshness & Refunds, Privacy, Terms)
- Responsive từ 375px, đạt chuẩn WCAG AA về tương phản, có focus ring, điều hướng bàn phím, hỗ trợ reduced-motion

## Cấu trúc

```
src/data/catalog.json    ← sản phẩm, giá, add-on, gói subscription, vùng giao hàng (SỬA Ở ĐÂY)
src/data/site.json       ← tên, địa chỉ, điện thoại, email, giờ mở cửa
src/data/content.ts      ← đánh giá, bài Journal, FAQ
src/app/                 ← các trang (App Router)
src/app/api/*/route.server.ts ← API cho cách A (chỉ build khi không xuất tĩnh)
src/server/              ← logic Stripe & gửi email cho cách A
src/components/          ← component giao diện
hosting/static/          ← .htaccess + PHP cho cách B (được chép vào out/ khi build tĩnh)
design-system/MASTER.md  ← quy tắc thiết kế
docs/REVIEWS.md          ← quy trình thu đánh giá & quy tắc FTC
```

## Chạy trên máy

```bash
npm install
cp .env.example .env.local   # điền key test để thử thanh toán/form trên máy
npm run dev                  # http://localhost:3000
```

## Cách A: Hostinger Node.js Web App (khuyên dùng)

1. hPanel → **Triển khai** → kết nối GitHub repo `nha-ideaburstflowers`, nhánh `main`, framework **Next.js**.
   Để các thiết lập build mặc định: lệnh build là `npm run build`, lệnh chạy là `npm start`. Nên chọn **Node.js 22** nếu có.
2. hPanel → **Biến môi trường**: thêm các biến trong [`.env.example`](.env.example):
   - `STRIPE_SECRET_KEY`: Stripe Dashboard → Developers → API keys (bắt đầu bằng `sk_test_` khi thử)
   - `SITE_URL`: `https://ideaburstflowers.com`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: hộp thư Hostinger, tạo ở hPanel → Emails. Máy chủ là `smtp.hostinger.com`, cổng `465`
   - `MAIL_FROM`, `MAIL_TO`: địa chỉ gửi và địa chỉ nhận email từ form
3. Bấm **Tái triển khai**. Mỗi lần `git push` lên `main`, Hostinger sẽ tự build lại.
4. Test thanh toán với thẻ `4242 4242 4242 4242` (ngày hết hạn bất kỳ trong tương lai, CVC bất kỳ). Khi đã ổn, đổi sang `sk_live_…`.

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) chỉ **kiểm tra code** sau mỗi lần push: cài đặt, kiểm tra kiểu và build giống hệt Hostinger. Nó không upload gì. Nếu dấu ✅ trên GitHub chuyển thành ❌, nghĩa là bản push đó có lỗi; Hostinger cũng sẽ build lỗi, nhưng website vẫn chạy bản cũ.

## Cách B: Tĩnh + PHP qua FTP (dự phòng cho gói không có Node.js)

1. Chép file [`hosting/ftp-deploy.workflow.yml`](hosting/ftp-deploy.workflow.yml) vào `.github/workflows/deploy.yml`, rồi thêm GitHub Secrets ở repo → **Settings → Secrets and variables → Actions**: `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`, và tuỳ chọn `FTP_SERVER_DIR` (mặc định `public_html/`).
2. Tạo file `~/ideaburst-config.php` ở thư mục **home**, cấp trên `public_html`, theo mẫu [`ideaburst-config.example.php`](ideaburst-config.example.php). Yêu cầu PHP ≥ 8.1.
3. Mỗi lần push, GitHub Actions sẽ chạy `npm run build:static` rồi upload `out/` lên Hostinger.

> ⚠️ Chỉ dùng **một** cách. Bật cả hai thì chúng sẽ ghi đè lẫn nhau. Lần deploy đầu sẽ ghi đè website cũ, nên hãy sao lưu trước (hPanel → Files → Backups).

Đơn hàng xem trong **Stripe Dashboard → Payments**. Mục *Metadata* của mỗi đơn có ngày giao, ZIP, người nhận, lời nhắn thiệp và hướng dẫn giao.

## Cần bạn rà soát trước khi chạy thật

- **Sản phẩm mẫu**: 6 sản phẩm có `"sample": true` trong `catalog.json` (Flathead Morning, Blush Peony Cloud, Classic Dozen Red Roses, White Tulip Study, Quiet Grace, Sunlit Field) là sản phẩm mới do tôi đề xuất. Giữ, sửa giá hoặc xoá tuỳ bạn.
- **Tên hiển thị**: 10 sản phẩm thật vẫn giữ SKU và giá gốc, nhưng được đặt thêm tên thương mại (ví dụ V338 → "Rosé Prosperity"). Hai mẫu Birthday đổi SKU từ TP001/TP002 thành **BD001/BD002**, vì trên site cũ chúng trùng mã với lan hồ điệp.
- **Giá lan TP002**: $25 cho 18 cành, rẻ hơn mẫu 6 cành ($48). Có vẻ dữ liệu cũ bị nhập nhầm, bạn kiểm tra lại giúp.
- **Phí giao hàng & ZIP**: vùng ngoài Kalispell ($12/$20) là đề xuất của tôi. Sửa trong `catalog.json → delivery`.
- **Add-on** (thiệp, socola, nến, bóng bay) và **giá gói định kỳ** cũng là đề xuất.
- **Ảnh**: đang dùng ảnh Unsplash (miễn phí bản quyền). Để thay bằng ảnh thật, đặt file vào `public/images/` rồi đổi `"image": "/images/ten-anh.jpg"`.
- **Chính sách**: các trang Privacy/Terms/Refunds là bản mẫu, nên nhờ luật sư xem lại.
- **Mạng xã hội**: điền link vào `site.json → social` khi có.
