# Thu thập & hiển thị đánh giá khách hàng

## Quy tắc FTC bắt buộc (16 CFR Part 465, hiệu lực từ 21/10/2024)

Vi phạm có thể bị phạt tới **hơn 50.000 USD cho mỗi vi phạm**.

| ✅ Được làm | ❌ Không được làm |
|---|---|
| Đăng đánh giá thật, giữ nguyên lời khách (được sửa lỗi chính tả, nhưng không đổi ý nghĩa) | Viết đánh giá giả, hoặc đổi tên/ảnh của người đánh giá |
| Hiển thị tên và ảnh **khi khách đã đồng ý** | Dùng ảnh stock hoặc ảnh người khác làm "khách hàng" |
| Mời **mọi** khách đánh giá, kể cả khách có thể chê | Chỉ mời khách hài lòng, hoặc giấu đánh giá xấu khi trang ghi "tất cả đánh giá" |
| Tặng quà cảm ơn cho **mọi** người đánh giá, bất kể khen hay chê, và **ghi rõ** "received a discount for reviewing" | Tặng quà với điều kiện phải khen |
| Đánh giá từ nhân viên/người thân phải ghi rõ mối quan hệ | Để nhân viên hoặc người thân đánh giá ẩn danh |

## Quy trình

1. **Sau mỗi đơn hàng** (khoảng 2 ngày sau khi giao), gửi email theo mẫu bên dưới.
2. Khách điền form tại **ideaburstflowers.com/reviews/write/**. Bạn sẽ nhận email "[IdeaBurst] New customer review", trong đó có ghi lại sự đồng ý của khách (thời gian và IP). **Hãy lưu lại email này** làm bằng chứng.
3. Nếu khách tick đồng ý gửi ảnh, hãy email xin ảnh. Lưu ảnh vuông (400×400px, định dạng .webp hoặc .jpg) vào `public/images/reviews/`.
4. Thêm vào đầu mảng `testimonials` trong `src/data/content.ts`:

```ts
{
  quote: "The peonies were stunning and lasted over a week. My mom cried happy tears!",
  name: "Sarah M.",            // đúng tên hiển thị khách đã chọn
  role: "Whitefish, MT",
  photo: "/images/reviews/sarah-m.webp",   // chỉ khi khách đồng ý
  occasion: "Birthday",
  source: "Website",
  rating: 5,
},
```

5. `git push`, website sẽ tự cập nhật. Trang chủ hiển thị 3 đánh giá đầu tiên trong mảng.
6. Khi mảng `testimonials` còn trống, trang chủ hiển thị dải cam kết thay cho phần đánh giá. Chỉ cần thêm đánh giá thật đầu tiên là phần đánh giá tự hiện lại. 4 đánh giá từ site cũ được lưu trong `archivedTestimonials` và không hiển thị.

## Google Reviews

Đánh giá trên Google Business Profile giúp SEO địa phương nhiều nhất. Vào business.google.com → *Ask for reviews* để lấy link, rồi dùng link đó trong email.

## Mẫu email xin đánh giá (tiếng Anh)

> **Subject:** How did your flowers arrive?
>
> Hi {First name},
>
> Your flowers were delivered on {date} — we hope they brought a smile!
>
> Would you take a minute to tell us how we did? Every review is read by our design team, and honest feedback (good or not-so-good) helps us improve.
>
> 👉 Write a review: https://ideaburstflowers.com/reviews/write/
>
> If anything wasn't perfect, just reply to this email — our 3-day freshness guarantee has you covered.
>
> With gratitude,
> The IdeaBurst Flowers team
> (907) 735-0634
