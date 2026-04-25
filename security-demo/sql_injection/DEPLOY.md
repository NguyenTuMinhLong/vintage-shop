# SQL Injection Security Demo - Deployment Guide

## Quick Deploy to InfinityFree

### Step 1: Download the Demo Package

The deploy package is ready at:
```
security-demo/sql_injection-deploy.zip
```

### Step 2: Create MySQL Database

1. Log into [InfinityFree Control Panel](https://dash.infinityfree.com/accounts/if0_41601452/domains/n4minhlong.wuaze.com)
2. Go to **MySQL Databases** → **Create New Database**
3. Note down these credentials:
   - MySQL Hostname
   - Database Name
   - Username
   - Password

### Step 3: Upload via File Manager

1. In InfinityFree Control Panel, go to **Control Panel** → **File Manager**
2. Navigate to `htdocs/`
3. Create folder: `security-demo`
4. Navigate into `security-demo/`
5. Click **Upload** → Select `sql_injection-deploy.zip`
6. Right-click the zip → **Extract**

### Step 4: Setup Database

1. Go to [phpMyAdmin](https://phpmyadmin.epizy.com/)
2. Select your database
3. Click **Import** → Select `setup.sql`
4. Click **Go**

### Step 5: Configure Credentials

1. In File Manager, edit `index.php`
2. Update these lines with your actual database credentials:

```php
$host = 'sql313.epizy.com';      // Your MySQL hostname
$dbname = 'epiz_XXXXXX_demo';    // Your database name
$dbuser = 'epiz_XXXXXX';         // Your MySQL username
$dbpass = 'your_password';       // Your MySQL password
```

### Step 6: Access Your Demo

Visit: `https://n4minhlong.wuaze.com/security-demo/sql_injection/`

---

## What's Included

| File | Description |
|------|-------------|
| `index.php` | Main demo with vulnerable vs secure comparison |
| `setup.sql` | Database schema and sample data |

## Features

- **Vulnerable Panel**: Direct string concatenation (insecure)
- **Secure Panel**: Prepared statements (safe)
- **Common SQL Injection Payloads**: Try attacks like `' OR '1'='1`
- **Product Search Demo**: Compare results
- **Login Demo**: See authentication bypass in action

## Security Warning

This demo intentionally includes VULNERABLE code for educational purposes. 
**Never use the vulnerable patterns in production applications.**

---

## Reference Links

- [W3Schools SQL Injection](https://www.w3schools.com/sql/sql_injection.asp)
- [W3Schools Parameterized Queries](https://www.w3schools.com/sql/sql_parameterized_queries.asp)
- [W3Schools Prepared Statements](https://www.w3schools.com/sql/sql_prepared_statements.asp)
- [XSS Demo (for comparison)](https://navshop.wuaze.com/security-demo/xss.php)
