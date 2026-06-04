# Report bài 1.1 - Kiểm tra tính hợp lệ của Block

## Mục tiêu

Triển khai hàm `isValidBlock(block)` trong `solution.ts` để kiểm tra `current_hash` của block có hợp lệ hay không.

Theo đề bài, `current_hash` phải bằng SHA256 của chuỗi:

```ts
index + timestamp + JSON.stringify(transactions) + previous_hash
```

## Vấn đề ban đầu

### 1. `solution.ts` chưa có logic xử lý

Trong file `solution.ts`, hàm `isValidBlock` ban đầu chỉ trả về `false`.

Điều này làm cho mọi block đều bị đánh giá là không hợp lệ, kể cả block có `current_hash` đúng.

Cách khắc phục:

- Import module `crypto` của Node.js.
- Ghép dữ liệu block theo đúng công thức trong `test.ts`.
- Hash bằng SHA256.
- So sánh hash tính được với `block.current_hash`.

Kết quả sau khi sửa:

```ts
const value = block.index + block.timestamp + JSON.stringify(block.transactions) + block.previous_hash;
const expectedHash = crypto.createHash("sha256").update(value).digest("hex");

return block.current_hash === expectedHash;
```

### 2. Lỗi khi patch lần đầu do encoding comment tiếng Việt

Khi sửa file lần đầu, patch không áp dụng được vì phần comment tiếng Việt trong file có khác biệt encoding so với nội dung đọc từ terminal.

Cách khắc phục:

- Không dựa vào comment tiếng Việt để xác định vị trí patch.
- Patch lại bằng các dòng code ổn định hơn, ví dụ `export type Block` và `return false`.

### 3. Lỗi chạy test do thiếu dependency cục bộ

Lần chạy test đầu tiên bằng:

```bash
npx ts-node run.ts bai1_1
```

gặp lỗi TypeScript:

```text
Cannot find name 'process'
```

Nguyên nhân:

- Thư mục `node_modules` chưa tồn tại.
- `@types/node` có trong `package.json`, nhưng chưa được cài vào local project.
- Khi dùng `npx`, `ts-node` chạy từ cache tạm nên không nhận đủ type definitions của repo.

Cách khắc phục:

```bash
npm ci
```

Sau khi cài dependency theo `package-lock.json`, test chạy được bình thường.

### 4. Cảnh báo bảo mật từ `npm ci`

Sau khi chạy `npm ci`, npm báo có `3 vulnerabilities`.

Cách xử lý:

- Chưa sửa trong phạm vi bài 1.1 vì đây là vấn đề dependency chung của project.
- Có thể kiểm tra thêm bằng `npm audit`.
- Nếu muốn sửa, cần cân nhắc vì `npm audit fix --force` có thể nâng version breaking change.

### 5. Sandbox Windows chặn một số lệnh shell

Một số lệnh shell ban đầu gặp lỗi:

```text
windows sandbox: spawn setup refresh
```

Cách khắc phục:

- Chạy lại các lệnh cần thiết với quyền được phê duyệt.
- Các lệnh quan trọng như test, kiểm tra git, commit và push được thực hiện lại sau khi có quyền phù hợp.

## Kiểm tra sau khi sửa

Đã chạy:

```bash
npx ts-node run.ts bai1_1
```

Kết quả:

```text
✅ Block 1: true
❌ Block 1 (sai): false
✅ Đã chạy xong bài: bai1_1
```

## Kết luận

- Bài 1.1 đã được xử lý đúng yêu cầu.
- `isValidBlock` hiện kiểm tra hash block bằng SHA256 theo đúng công thức của đề bài và test.
- Không sửa `test.ts`.
- Vấn đề dependency đã được xử lý bằng `npm ci`.
- Các cảnh báo bảo mật npm được ghi nhận nhưng chưa sửa vì nằm ngoài phạm vi bài.
