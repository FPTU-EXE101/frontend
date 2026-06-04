# Timeline phát triển Front-end PetHub

Ghi chú: Phần "đã thực hiện" được tổng hợp theo lịch sử commit và cấu trúc code hiện tại của dự án. Phần "dự kiến" bắt đầu sau ngày 03/06/2026 và được xây dựng giả định để lập kế hoạch đến hết tháng 8/2026.

## 1. Timeline đã thực hiện

| STT | Giai đoạn | Tuần | Ngày tháng năm | Việc làm gì |
|---:|---|---|---|---|
| 1 | Khởi tạo dự án | - | 07/12/2025 - 08/12/2025 | Khởi tạo frontend React + TypeScript + Vite, thêm React Query provider, cấu hình router nền tảng và chuẩn bị cấu trúc dự án ban đầu. |
| 2 | API và type nền tảng | - | 08/12/2025 | Tạo các type cơ bản cho user/auth, cấu hình `axiosClient`, xây dựng các API đầu tiên cho auth và user. |
| 3 | UI kit và layout public | - | 08/12/2025 | Cài đặt shadcn/ui, Tailwind CSS, thêm các component UI nền tảng như button, alert, avatar, navbar, footer, logo và loading page. |
| 4 | Landing page ban đầu | - | 08/12/2025 | Xây dựng landing page/public layout đầu tiên, cấu hình title PetHub, navbar, footer và các route public cơ bản. |
| 5 | Layout theo vai trò | - | 09/12/2025 | Xây dựng layout cho Admin, Manager, Staff và User; bổ sung sidebar theo vai trò, app sidebar, tooltip, sheet, input, skeleton và separator. |
| 6 | Điều hướng và auth UI sơ khai | - | 09/12/2025 - 10/12/2025 | Thêm nút đăng nhập trên navbar, dropdown menu, trang Login/Register, field UI cho form và route auth. |
| 7 | Chuẩn hóa Auth page | - | 10/12/2025 | Đổi tên file, chỉnh route login/register, chuẩn hóa UI tiếng Anh ở một số phần và hoàn thiện bộ file trang Auth ban đầu. |
| 8 | Cải thiện Login/Register | - | 11/05/2026 | Nâng cấp giao diện đăng nhập/đăng ký, chỉnh navbar/footer, sửa ảnh logo và cải thiện trải nghiệm form auth. |
| 9 | Tích hợp Auth API | - | 13/05/2026 | Tích hợp API đăng nhập/đăng ký/xác nhận email, xử lý trạng thái đăng nhập trên navbar, điều hướng theo user và lưu token phía frontend. |
| 10 | Xác nhận email | - | 13/05/2026 | Cấu hình luồng confirm email, thêm trang thông báo kiểm tra email, chỉnh `authAPI` và route `confirm-email`/`verify-email-notice`. |
| 11 | Manager UI cơ bản | - | 14/05/2026 | Xây dựng layout quản lý cho Manager gồm dashboard, customer, pet, appointment, service, category, product, CRM, payment, automation và setting. |
| 12 | Quản lý service/product | - | 14/05/2026 | Tích hợp Items API, xây dựng danh sách service/product, form tạo mới item và bổ sung chức năng sửa service/product. |
| 13 | Medical Record cho pet | - | 14/05/2026 | Phát triển trang hồ sơ y tế cho thú cưng, API medical record, danh sách medical record theo pet và form tạo hồ sơ y tế mới. |
| 14 | Quản lý pet phía Manager | Tuần 1 | 16/05/2026 | Xây dựng trang tạo pet cho Manager, tích hợp Pet API/User API, kiểm tra customer khi tạo pet và chỉnh logic thêm pet. |
| 15 | Giao diện pet phía User | Tuần 1 | 16/05/2026 - 17/05/2026 | Tách cấu trúc trang pet của user thành PetCard, PetDetailModal và helper; hiển thị danh sách pet, chi tiết pet và thông tin liên quan. |
| 16 | Booking phía User | Tuần 1 | 17/05/2026 | Xây dựng trang tạo lịch hẹn cho user, chọn pet, chọn service, chọn ngày/giờ, StepBar, Calendar, TimeSlotPicker và API appointment. |
| 17 | Validation và hủy booking | Tuần 1 | 17/05/2026 | Bổ sung validation khi đặt lịch, xử lý hủy/xóa booking, dọn log thừa và cải thiện danh sách lịch hẹn của user. |
| 18 | Trang giới thiệu | Tuần 1 | 16/05/2026 - 17/05/2026 | Thêm About Us và Features, cập nhật navbar và route public cho các trang giới thiệu sản phẩm. |
| 19 | Appointment Manager | Tuần 1 | 18/05/2026 | Phát triển module quản lý lịch hẹn cho Manager gồm calendar, list, form tạo/sửa, constants, types, utils và xử lý trạng thái lịch hẹn. |
| 20 | Reminder và trạng thái lịch hẹn | Tuần 1 | 18/05/2026 | Tích hợp appointment reminder API, thêm nút trạng thái trong danh sách lịch hẹn và chỉnh các màn hình liên quan đến appointment. |
| 21 | Cấu hình deploy | Tuần 1 | 18/05/2026 | Thêm cấu hình Vercel và điều chỉnh nhỏ để phục vụ deploy frontend. |
| 22 | Payment/POS | Tuần 1 | 21/05/2026 | Xây dựng trang POS Payment gồm chọn appointment, chọn service/product, giỏ hàng, tổng tiền, utility tính toán, hook xử lý POS và tích hợp invoice API. |
| 23 | Cải thiện UI tổng thể | Tuần 1 | 21/05/2026 | Cải thiện navbar/footer, giao diện quản lý customer, payment và appointment list; tách AppointmentListItem để code dễ quản lý hơn. |
| 24 | Digital Pet Card | Tuần 2 | 24/05/2026 | Thêm QR code cho pet, trang thẻ thú cưng công khai `/pet-card/:petId`, nút xem/copy link thẻ pet trong giao diện user/manager. |
| 25 | Landing page có video | Tuần 2 | 29/05/2026 | Cập nhật home/about/features, thêm video trong `public/videos`, thay đổi nội dung giới thiệu và cải thiện trải nghiệm trang chủ. |
| 26 | Cải thiện confirm email | Tuần 2 | 29/05/2026 | Sửa API confirm email, test lại luồng xác nhận, điều hướng sau đăng ký và thông báo kiểm tra email. |
| 27 | Lazy loading route/page | Tuần 2 | 29/05/2026 | Chuyển nhiều page/layout sang `React.lazy` + `Suspense`, thêm fallback loading để giảm tải bundle ban đầu và cải thiện tốc độ điều hướng. |
| 28 | Tạo pet phía User | Tuần 2 | 29/05/2026 | Thêm trang tạo pet cho user, route `/user/pet/new`, cập nhật user pet/service/booking để phù hợp với luồng mới. |
| 29 | Error handling frontend | Tuần 3 | 30/05/2026 | Tạo `getBackendErrorMessage`, chuẩn hóa hiển thị lỗi backend ở auth, manager, booking, pet, medical record và POS; thêm ErrorBoundary và pagination controls. |
| 30 | Cải thiện API client | Tuần 3 | 30/05/2026 | Điều chỉnh các API appointment, reminder, invoice, items, medical record, pet, user để xử lý dữ liệu và lỗi ổn định hơn. |
| 31 | Validation TimeSlotPicker | Tuần 3 | 31/05/2026 | Bổ sung validation chọn ngày/giờ đặt lịch, kiểm tra timeslot hợp lệ trong trang tạo booking và cải thiện thông báo lỗi cho user. |
| 32 | Cải thiện form Auth | Tuần 3 | 31/05/2026 | Thêm hiển thị/ẩn mật khẩu, cải thiện login/register form và cập nhật thông báo xác nhận email sau khi đăng ký. |
| 33 | Dashboard Manager | Tuần 3 | 03/06/2026 | Phát triển dashboard thống kê doanh thu cho Manager: tổng doanh thu thực tế, doanh thu dự kiến, số invoice theo trạng thái, giá trị đơn trung bình, biểu đồ doanh thu và invoice gần đây. |
| 34 | Biểu đồ doanh thu | Tuần 3 | 03/06/2026 | Tích hợp Recharts cho dashboard, hỗ trợ lọc theo ngày/tuần/tháng và chuyển đổi giữa biểu đồ đường/cột. |
| 35 | CRM khách hàng | Tuần 3 | 03/06/2026 | Phát triển trang CRM cho Manager: thống kê VIP/thân thiết/mới, tổng doanh thu, tìm kiếm/lọc khách hàng và bảng dữ liệu CRM. |
| 36 | Logic phân hạng khách hàng | Tuần 3 | 03/06/2026 | Thêm `membershipTier`, lấy invoice theo customer qua `/api/invoice/customer/{customerId}`, tính số lần đến, tổng chi tiêu, lần cuối sử dụng dịch vụ và phân hạng khách hàng. |
| 37 | Profile khách hàng | Tuần 3 | 03/06/2026 | Thêm trang customer profile phía user, route `/user/profile` và giao diện hiển thị thông tin cá nhân/khách hàng. |

## 2. Timeline dự kiến đến hết tháng 8/2026

| STT | Tuần | Ngày tháng năm | Việc làm gì |
|---:|---|---|---|
| 1 | Tuần 1 | 08/06/2026 - 14/06/2026 | Hoàn thiện Dashboard Manager: tinh chỉnh biểu đồ doanh thu, empty state, loading state, xử lý lỗi khi invoice/customer API trả dữ liệu thiếu và chuẩn hóa giao diện thống kê. |
| 2 | Tuần 2 | 15/06/2026 - 21/06/2026 | Phát triển Dashboard Admin: thống kê tổng user, manager, staff, customer, pet, appointment, invoice và doanh thu toàn hệ thống. |
| 3 | Tuần 3 | 22/06/2026 - 28/06/2026 | Xây dựng trang quản lý người dùng cho Admin: danh sách tài khoản, tìm kiếm, lọc theo role/trạng thái và xem chi tiết user. |
| 4 | Tuần 4 | 29/06/2026 - 05/07/2026 | Hoàn thiện phân quyền giao diện: bảo vệ route theo role, xử lý redirect khi truy cập sai quyền và đồng bộ sidebar/navbar theo trạng thái đăng nhập. |
| 5 | Tuần 5 | 06/07/2026 - 12/07/2026 | Nâng cấp Appointment Manager: thêm check-in/check-out, timeline lịch hẹn, lọc nâng cao theo trạng thái/ngày/khách hàng và cải thiện calendar. |
| 6 | Tuần 6 | 13/07/2026 - 19/07/2026 | Phát triển Staff workspace: danh sách lịch hẹn được phân công, cập nhật trạng thái phục vụ, ghi chú nội bộ và xem nhanh thông tin pet/customer. |
| 7 | Tuần 7 | 20/07/2026 - 26/07/2026 | Hoàn thiện Medical Record: chỉnh sửa hồ sơ y tế, lịch sử khám, chi tiết hồ sơ, validation form và liên kết rõ hơn giữa pet, customer và appointment. |
| 8 | Tuần 8 | 27/07/2026 - 02/08/2026 | Phát triển Inventory/Product UI nâng cao: tồn kho, cảnh báo số lượng thấp, lịch sử nhập/xuất và filter theo danh mục/sản phẩm. |
| 9 | Tuần 9 | 03/08/2026 - 09/08/2026 | Cải thiện Payment/POS: hỗ trợ giảm giá, voucher, nhiều phương thức thanh toán, xuất/in invoice và trạng thái thanh toán rõ ràng hơn. |
| 10 | Tuần 10 | 10/08/2026 - 16/08/2026 | Xây dựng Loyalty cho khách hàng: điểm tích lũy, lịch sử chi tiêu, hạng thành viên, ưu đãi và giao diện đổi thưởng. |
| 11 | Tuần 11 | 17/08/2026 - 23/08/2026 | Phát triển Notification Center: thông báo lịch hẹn, thanh toán, nhắc lịch chăm sóc/thăm khám pet và trạng thái đã đọc/chưa đọc. |
| 12 | Tuần 12 | 24/08/2026 - 30/08/2026 | Rà soát responsive và UI/UX toàn hệ thống: dashboard, table, form, sidebar, booking, payment, CRM; sửa lỗi hiển thị trên mobile/tablet và chuẩn bị bản demo cuối tháng 8. |
