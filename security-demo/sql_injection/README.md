# SQL Injection Security Demo

Demo bảo mật SQL Injection tương tự như XSS demo tại [navshop.wuaze.com/security-demo/xss.php](https://navshop.wuaze.com/security-demo/xss.php)

## Tính năng

- So sánh trực quan giữa **truy vấn dễ bị tấn công** và **Prepared Statements an toàn**
- Demo tìm kiếm sản phẩm
- Demo đăng nhập
- Các payload SQL Injection phổ biến để thử nghiệm

## Triển khai lên InfinityFree

### Bước 1: Upload lên InfinityFree

1. Đăng nhập [InfinityFree Control Panel](https://dash.infinityfree.com/accounts/if0_41601452/domains/n4minhlong.wuaze.com)
2. Upload toàn bộ thư mục `sql_injection/` vào `htdocs/security-demo/`

### Bước 2: Tạo Database

1. Đăng nhập vào [InfinityFree phpMyAdmin](https://phpmyadmin.epizy.com/)
2. Import file `setup.sql`

### Bước 3: Cập nhật kết nối Database

Chỉnh sửa `index.php` và cập nhật thông tin database:

```php
$host = 'sql313.epizy.com';
$dbname = 'epiz_XXXXXX_demo';
$dbuser = 'epiz_XXXXXX';
$dbpass = 'your_password';
```

### Bước 4: Truy cập Demo

Truy cập: `https://n4minhlong.wuaze.com/security-demo/sql_injection/`

## Tham khảo

- [W3Schools SQL Injection Tutorial](https://www.w3schools.com/sql/sql_injection.asp)
- [W3Schools Parameterized Queries](https://www.w3schools.com/sql/sql_parameterized_queries.asp)
- [W3Schools Prepared Statements](https://www.w3schools.com/sql/sql_prepared_statements.asp)
