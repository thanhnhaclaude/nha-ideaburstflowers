# IdeaBurst Flowers — Website

Website thương mại điện tử cao cấp cho **IdeaBurst Flowers** (Kalispell, Montana).
Next.js 16 xuất tĩnh (static export) + PHP endpoint cho Stripe Checkout. Chạy được trên **gói Hostinger Premium/Single**, không cần Node.js server.

## Tính năng

- 45 trang tĩnh, đã tối ưu SEO: metadata, Open Graph, sitemap, robots, JSON-LD (Florist, Product, FAQ, BlogPosting)
- Shop, 6 bộ sưu tập, 16 sản phẩm, quà tặng kèm (add-on)
- Giỏ hàng lưu trên trình duyệt, drawer, trang giỏ hàng gồm ZIP, ngày giao, người nhận, lời nhắn thiệp
- **Stripe Checkout** (thẻ, Apple Pay, Google Pay). Giá luôn được tính lại phía server từ `catalog.json`
- Gói hoa định kỳ (Stripe subscription): 3 cỡ × 3 tần suất, có giảm giá
- Kiểm tra vùng giao hàng theo ZIP, 3 vùng phí, chặn giờ same-day lúc 2 PM giờ Mountain
- Trang Cưới & Sự kiện kèm form tư vấn; Liên hệ; Newsletter (gửi email qua PHP `mail()`)
- Journal/blog (4 bài), FAQ, chính sách (Freshness & Refunds, Privacy, Terms)
- Responsive từ 375px, đạt chuẩn WCAG AA về tương phản, có focus ring, điều hướng bàn phím, hỗ trợ reduced-motion

## Cấu trúc

```
src/data/catalog.json   ← sản phẩm, giá, add-on, gói subscription, vùng giao hàng (SỬA Ở ĐÂY)
src/data/site.json      ← tên, địa chỉ, điện thoại, email, giờ mở cửa
src/data/content.ts     ← testimonials, bài Journal, FAQ
src/app/                ← các trang (App Router)
src/components/         ← component giao diện
public/api/*.php        ← checkout.php (Stripe), inquiry.php (email)
public/.htaccess        ← HTTPS, URL sạch, cache, security headers
design-system/MASTER.md ← quy tắc thiết kế
```

## Chạy trên máy

```bash
npm install
npm run dev        # http://localhost:3000 (form & checkout cần PHP nên chỉ chạy sau khi deploy)
npm run build      # xuất ra thư mục out/
```

## Deploy lên Hostinger (gói Premium/Single)

### 1. Đẩy code lên GitHub

```bash
git remote add origin https://github.com/<tai-khoan>/ideaburst-flowers.git
git push -u origin main
```

### 2. Lấy thông tin FTP trên Hostinger

hPanel → **Files → FTP Accounts**. Ghi lại *FTP hostname* (hoặc IP), *username* và *password*.

### 3. Thêm GitHub Secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Giá trị |
|---|---|
| `FTP_SERVER` | FTP hostname, ví dụ `ftp.ideaburstflowers.com` hoặc IP |
| `FTP_USERNAME` | ví dụ `u123456789` |
| `FTP_PASSWORD` | mật khẩu FTP |
| `FTP_SERVER_DIR` | *(tuỳ chọn)* mặc định `public_html/`. Với addon domain: `domains/ideaburstflowers.com/public_html/` |

Từ đó, mỗi lần `git push` lên `main`, GitHub Actions sẽ tự chạy kiểm tra kiểu, build rồi upload thư mục `out/` lên Hostinger.
Nếu bước FTP báo lỗi TLS, đổi `protocol: ftps` thành `protocol: ftp` trong `.github/workflows/deploy.yml`.

> ⚠️ Lần deploy đầu tiên sẽ **ghi đè** website cũ trong `public_html`. Hãy sao lưu trước: hPanel → Files → Backups, hoặc tải `public_html` về máy.

### 4. Cấu hình Stripe và email (làm một lần)

1. Tạo tài khoản tại [stripe.com](https://stripe.com), lấy **Secret key** (bắt đầu bằng `sk_test_`) ở Developers → API keys.
2. Trong hPanel → **File Manager**, mở thư mục **home** (cấp *trên* `public_html`). Tạo file `ideaburst-config.php` với nội dung theo mẫu [`ideaburst-config.example.php`](ideaburst-config.example.php).
   File này nằm ngoài web root nên không ai truy cập được qua trình duyệt, và không bao giờ nằm trong Git.
3. Tạo hộp thư `no-reply@ideaburstflowers.com` trong hPanel → Emails (dùng làm địa chỉ gửi).
4. Kiểm tra PHP ≥ 8.1: hPanel → Advanced → PHP Configuration.
5. Test với thẻ `4242 4242 4242 4242` (ngày hết hạn bất kỳ trong tương lai, CVC bất kỳ). Khi đã ổn, thay bằng `sk_live_…`.

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
