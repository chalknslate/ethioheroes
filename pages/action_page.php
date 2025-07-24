<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fname = $_POST['fname'] ?? '';
    $lname = $_POST['lname'] ?? '';

    $host = 'ep-falling-hall-aeql1z83-pooler.c-2.us-east-2.aws.neon.tech';
    $db   = 'neondb';
    $user = 'neondb_owner';
    $pass = 'npg_xkhtaL2id6Pv';
    $port = '5432';
    $sslmode = 'require';

    $dsn = "pgsql:host=$host;port=$port;dbname=$db;sslmode=$sslmode";

    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);

        $stmt = $pdo->prepare("INSERT INTO users (username, password) VALUES (:fname, :lname)");
        $stmt->execute([
            ':fname' => $fname,
            ':lname' => $lname
        ]);

        echo "User added successfully!";
    } catch (PDOException $e) {
        if ($e->getCode() == '23505') {
            // Unique violation error code in Postgres
            echo "Error: Username already exists. Please choose another.";
        } else {
            echo "Connection failed: " . $e->getMessage();
        }
    }
} else {
    echo "Invalid request.";
}
?>
