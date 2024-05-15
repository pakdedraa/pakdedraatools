<?php
session_start();
// Konfigurasi koneksi database
$DATABASE_HOST = 'Indraaa';
$DATABASE_USER = 'root';
$DATABASE_PASS = '';
$DATABASE_NAME = 'user_level';
$con = mysqli_connect($DATABASE_HOST, $DATABASE_USER, $DATABASE_PASS, $DATABASE_NAME);
if (mysqli_connect_errno()) {
    exit('Failed to connect to MySQL: ' . mysqli_connect_error());
}

// Cek apakah data dari form login telah di-submit
if (!isset($_POST['username'], $_POST['password'])) {
    exit('Please fill both the username and password fields!');
}

// Persiapan SQL untuk mencegah SQL injection
if ($stmt = $con->prepare('SELECT id, password FROM accounts WHERE username = ?')) {
    $stmt->bind_param('s', $_POST['username']);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $password);
        $stmt->fetch();
        // Verifikasi password
        if (password_verify($_POST['password'], $password)) {
            // Sukses, buat session
            session_regenerate_id();
            $_SESSION['loggedin'] = TRUE;
            $_SESSION['name'] = $_POST['username'];
            $_SESSION['id'] = $id;
            // Jika username adalah admin, redirect ke index.html
            if ($_POST['username'] === 'admin') {
                header('Location: index.html');
                exit;
            } else {
                // Redirect ke halaman home.php untuk user biasa
                header('Location: home.php');
                exit;
            }
        } else {
            // Password salah
            echo 'Incorrect username and/or password!';
        }
    } else {
        // Username tidak ditemukan
        echo 'Incorrect username and/or password!';
    }

    $stmt->close();
}
?>