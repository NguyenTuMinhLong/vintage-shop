# Security Demo Collection

Demo bảo mật PHP theo W3Schools, triển khai trên n4minhlong.wuaze.com

## Các Demo Có Sẵn

### 1. SQL Injection Demo
- **File:** `sql-injection.html` (HTML) hoặc `sql_injection/index.php` (PHP + MySQL)
- **URL:** https://n4minhlong.wuaze.com/security-demo/sql-injection.html
- **Chủ đề:** Prepared Statements vs String Concatenation
- **Tham khảo:** [W3Schools SQL Injection](https://www.w3schools.com/sql/sql_injection.asp)

### 2. Form Validation Demo
- **File:** `form-validation.html`
- **Chủ đề:** `$_SERVER["PHP_SELF"]` XSS Vulnerability
- **Tham khảo:** [W3Schools PHP Form Validation](https://www.w3schools.com/php/php_form_validation.asp)

## Triển Khai

### HTML Version (Khuyến nghị)
Upload file `.html` trực tiếp lên `htdocs/` của hosting.

### PHP + MySQL Version
1. Tạo database trên InfinityFree
2. Import `sql_injection/setup.sql`
3. Cập nhật credentials trong `sql_injection/index.php`
4. Upload lên `htdocs/security-demo/sql_injection/`

## Cấu Trúc Files

```
security-demo/
├── README.md
├── sql-injection.html          # HTML version (standalone)
├── sql-injection.php           # PHP standalone version
├── form-validation.html        # Form validation demo
└── sql_injection/              # PHP + MySQL version
    ├── index.php
    ├── setup.sql
    └── config.ini
```

## Demo Hoàn Chỉnh

Xem demo đang chạy tại:
- https://navshop.wuaze.com/security-demo/sql-injection.php
