<?php
/**
 * SQL Injection Security Demo
 * Matching the navshop.wuaze.com style
 * 
 * Demonstrates the difference between vulnerable string concatenation
 * and safe prepared statements.
 */

// Demo users (simulated database for standalone demo)
$users = [
    ['full_name' => 'Quản trị Demo', 'email' => 'admin@example.com', 'password' => 'admin123', 'role' => 'admin'],
    ['full_name' => 'Sinh viên Demo', 'email' => 'student@example.com', 'password' => 'student123', 'role' => 'student'],
    ['full_name' => 'Khách Demo', 'email' => 'guest@example.com', 'password' => 'guest123', 'role' => 'guest'],
];

$vuln_success = false;
$vuln_message = '';
$safe_success = false;
$safe_message = '';
$vuln_sql = '';
$safe_sql = '';

// Vulnerable Login (string concatenation)
if (isset($_POST['vuln'])) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Build the vulnerable SQL query string
    $vuln_sql = "SELECT full_name, email, role FROM demo_users WHERE email = '$email' AND password = '$password' LIMIT 1";
    
    // Check for SQL injection patterns
    if (strpos($email, "'") !== false) {
        // Simulate successful injection attack
        $vuln_success = true;
        $vuln_message = "ĐĂNG NHẬP THÀNH CÔNG! Payload SQL Injection đã hoạt động!<br><br>";
        $vuln_message .= "Chào <strong>Quản trị Demo</strong> (Role: admin)<br><br>";
        $vuln_message .= "<strong>⚠️ Lý do thành công:</strong> Ký tự <code>'</code> và <code>--</code> biến phần mật khẩu thành comment SQL, không cần mật khẩu đúng!<br><br>";
        $vuln_message .= "<strong>Câu truy vấn thực tế:</strong><br><code style='color:#ff7b72;'>" . htmlspecialchars($vuln_sql) . "</code>";
    } else {
        // Normal login check
        foreach ($users as $user) {
            if ($user['email'] === $email && $user['password'] === $password) {
                $vuln_success = true;
                $vuln_message = "Đăng nhập thành công! Chào {$user['full_name']} (Role: {$user['role']})";
                break;
            }
        }
        if (!$vuln_success) {
            $vuln_message = "Đăng nhập thất bại! Email hoặc mật khẩu không đúng.";
        }
    }
}

// Safe Login (prepared statement simulation)
if (isset($_POST['safe'])) {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Prepared statement query
    $safe_sql = "SELECT full_name, email, role FROM demo_users WHERE email = ? AND password = ? LIMIT 1";
    
    // Check credentials (safe comparison)
    $found = false;
    foreach ($users as $user) {
        if ($user['email'] === $email && $user['password'] === $password) {
            $found = true;
            $safe_success = true;
            $safe_message = "Đăng nhập thành công! Chào {$user['full_name']} (Role: {$user['role']})";
            break;
        }
    }
    
    if (!$found) {
        // Try injection patterns - they WON'T work with prepared statements
        if (strpos($email, "'") !== false) {
            $safe_message = "Đăng nhập thất bại! Email hoặc mật khẩu không đúng.<br><br>";
            $safe_message .= "⚠️ <strong>SQL Injection không hoạt động!</strong> Prepared statement coi dữ liệu đầu vào là văn bản thuần, không phải SQL code.";
        } else {
            $safe_message = "Đăng nhập thất bại! Email hoặc mật khẩu không đúng.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo SQL Injection | Demo Bảo Mật PHP</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0d1117;
            color: #c9d1d9;
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        header {
            background: linear-gradient(135deg, #161b22, #21262d);
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        header h1 { font-size: 2rem; margin-bottom: 10px; color: #f0f6fc; }
        .badge {
            display: inline-block;
            background: #f8514966;
            color: #f85149;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
        }
        h2 { color: #58a6ff; margin: 30px 0 15px; font-size: 1.4rem; }
        .section {
            background: #161b22;
            border: 1px solid #30363d;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 20px;
        }
        .intro {
            color: #8b949e;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        .demo-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-top: 20px;
        }
        @media (max-width: 768px) {
            .demo-grid { grid-template-columns: 1fr; }
        }
        .danger { border-left: 4px solid #f85149; }
        .safe { border-left: 4px solid #3fb950; }
        .label {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.85rem;
            margin-bottom: 15px;
        }
        .label-danger { background: #f8514933; color: #f85149; }
        .label-safe { background: #3fb95033; color: #3fb950; }
        h3 { color: #c9d1d9; margin-bottom: 15px; font-size: 1.1rem; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: 500; color: #8b949e; font-size: 0.9rem; }
        input[type="email"], input[type="password"] {
            width: 100%;
            padding: 10px 12px;
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            color: #c9d1d9;
            font-size: 0.95rem;
        }
        input:focus {
            outline: none;
            border-color: #58a6ff;
        }
        button {
            background: #238636;
            color: #fff;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: background 0.2s;
        }
        button:hover { background: #2ea043; }
        .btn-danger { background: #da3633; }
        .btn-danger:hover { background: #f85149; }
        .btn-safe { background: #1f6feb; }
        .btn-safe:hover { background: #388bfd; }
        .sql-query {
            background: #0d1117;
            border: 1px solid #30363d;
            border-radius: 6px;
            padding: 15px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 0.85rem;
            color: #79c0ff;
            overflow-x: auto;
            margin-top: 15px;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .sql-keyword { color: #ff7b72; }
        .sql-string { color: #a5d6ff; }
        .result {
            margin-top: 15px;
            padding: 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .result-success {
            background: #3fb95022;
            border: 1px solid #3fb950;
            color: #3fb950;
        }
        .result-error {
            background: #f8514922;
            border: 1px solid #f85149;
            color: #f85149;
        }
        .info-box {
            background: #58a6ff22;
            border: 1px solid #58a6ff;
            border-radius: 6px;
            padding: 12px 15px;
            margin: 15px 0;
            font-size: 0.9rem;
        }
        .info-box strong { color: #58a6ff; }
        .info-box code {
            background: #0d1117;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Consolas', monospace;
            color: #79c0ff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #30363d;
        }
        th {
            background: #21262d;
            color: #8b949e;
            font-weight: 600;
            font-size: 0.9rem;
        }
        td code {
            background: #0d1117;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.85rem;
            color: #79c0ff;
        }
        .hint {
            background: #f0883e22;
            border: 1px solid #f0883e;
            border-radius: 6px;
            padding: 12px 15px;
            margin-top: 20px;
            font-size: 0.9rem;
        }
        .hint strong { color: #f0883e; }
        .actions { margin-top: 15px; }
        .actions button { margin-right: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Demo SQL Injection</h1>
            <span class="badge">Demo Bảo Mật PHP</span>
        </header>

        <section class="section">
            <h2>Đăng nhập dễ lỗi và prepared statement</h2>
            <p class="intro">
                Trang này minh họa cách nối chuỗi trực tiếp có thể khiến dữ liệu người dùng làm thay đổi câu truy vấn SQL. Ví dụ an toàn dùng placeholder và prepared statement.
            </p>
            
            <div class="info-box">
                <strong>Tài khoản mẫu thật:</strong> <code>admin@example.com</code> / <code>admin123</code>
            </div>
            
            <div class="hint">
                <strong>Payload gợi ý:</strong> <code>admin@example.com' -- </code> với bất kỳ mật khẩu nào
            </div>
        </section>

        <div class="demo-grid">
            <!-- Vulnerable Version -->
            <div class="section danger">
                <span class="label label-danger">Nguy hiểm</span>
                <h3>Nối chuỗi trực tiếp</h3>
                
                <form method="post" action="?vuln=1">
                    <div class="form-group">
                        <label for="vuln_email">Email</label>
                        <input type="email" name="email" id="vuln_email" placeholder="admin@example.com" 
                               value="<?php echo isset($_POST['vuln']) && isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="vuln_pass">Mật khẩu</label>
                        <input type="password" name="password" id="vuln_pass" placeholder="********">
                    </div>
                    <div class="actions">
                        <button type="submit" class="btn-danger">Chạy đăng nhập nguy hiểm</button>
                    </div>
                </form>

                <div class="sql-query"><span class="sql-keyword">SELECT</span> full_name, email, role <span class="sql-keyword">FROM</span> demo_users 
<span class="sql-keyword">WHERE</span> email = <span class="sql-string">'[input]'</span> <span class="sql-keyword">AND</span> password = <span class="sql-string">'[input]'</span> <span class="sql-keyword">LIMIT 1</span></div>

                <?php if (isset($_POST['vuln'])): ?>
                <div class="result <?php echo $vuln_success ? 'result-success' : 'result-error'; ?>">
                    <?php echo $vuln_message; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Safe Version -->
            <div class="section safe">
                <span class="label label-safe">An toàn</span>
                <h3>Prepared statement an toàn</h3>
                
                <form method="post" action="?safe=1">
                    <div class="form-group">
                        <label for="safe_email">Email</label>
                        <input type="email" name="email" id="safe_email" placeholder="admin@example.com"
                               value="<?php echo isset($_POST['safe']) && isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
                    </div>
                    <div class="form-group">
                        <label for="safe_pass">Mật khẩu</label>
                        <input type="password" name="password" id="safe_pass" placeholder="********">
                    </div>
                    <div class="actions">
                        <button type="submit" class="btn-safe">Chạy đăng nhập an toàn</button>
                    </div>
                </form>

                <div class="sql-query"><span class="sql-keyword">SELECT</span> full_name, email, role <span class="sql-keyword">FROM</span> demo_users 
<span class="sql-keyword">WHERE</span> email = <span class="sql-string">?</span> <span class="sql-keyword">AND</span> password = <span class="sql-string">?</span> <span class="sql-keyword">LIMIT 1</span></div>

                <?php if (isset($_POST['safe'])): ?>
                <div class="result <?php echo $safe_success ? 'result-success' : 'result-error'; ?>">
                    <?php echo $safe_message; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <section class="section" style="margin-top: 30px;">
            <h2>Dữ liệu mẫu dùng cho demo</h2>
            <table>
                <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Email</th>
                        <th>Mật khẩu</th>
                        <th>Vai trò</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Quản trị Demo</td>
                        <td><code>admin@example.com</code></td>
                        <td><code>admin123</code></td>
                        <td>admin</td>
                    </tr>
                    <tr>
                        <td>Sinh viên Demo</td>
                        <td><code>student@example.com</code></td>
                        <td><code>student123</code></td>
                        <td>student</td>
                    </tr>
                    <tr>
                        <td>Khách Demo</td>
                        <td><code>guest@example.com</code></td>
                        <td><code>guest123</code></td>
                        <td>guest</td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</body>
</html>
