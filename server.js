const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const _ = require("lodash");

const app = express();
app.use(express.json());

/* =============================================
   VULNERABLE: Hard-coded credentials (FAKE)
============================================= */
const DB_USER = "admin";
const DB_PASS = "password123";
const JWT_SECRET = "supersecretjwtkey123"; // fake demo secret

/* =============================================
   VULNERABLE: MySQL connection (no SSL, unsafe config)
============================================= */
const db = mysql.createConnection({
    host: "localhost",
    user: DB_USER,
    password: DB_PASS,
    database: "testdb"
});

/* =============================================
   VULNERABLE: SQL Injection
   URL example: /user?id=1 OR 1=1
============================================= */
app.get("/user", (req, res) => {
    const id = req.query.id; 
    const query = `SELECT * FROM users WHERE id = ${id}`; // ❌ unsafe

    db.query(query, (err, results) => {
        if (err) return res.send("DB Error");
        res.json(results);
    });
});

/* =============================================
   VULNERABLE: Command Injection
   Example: /ping?host=google.com;ls
============================================= */
app.get("/ping", (req, res) => {
    const host = req.query.host;
    const exec = require("child_process").exec;

    exec(`ping -c 1 ${host}`, (err, output) => {
        if (err) return res.send("Error");
        res.send(output);
    });
});

/* =============================================
   VULNERABLE: Prototype Pollution
============================================= */
app.post("/merge", (req, res) => {
    const unsafe = req.body;
    const result = _.merge({}, unsafe); 
    res.json(result);
});

/* =============================================
   VULNERABLE: Hard-coded API key (FAKE)
============================================= */
app.get("/external", async (req, res) => {
    const API_KEY = "FAKE-API-KEY-123456789"; // fake for testing

    try {
        const response = await axios.get("https://example.com/data?key=" + API_KEY);
        res.json(response.data);
    } catch (err) {
        res.send("External API Error");
    }
});

/* =============================================
   VULNERABLE: Weak JWT (hard-coded secret)
============================================= */
app.post("/login", (req, res) => {
    const token = jwt.sign(
        { user: req.body.username }, 
        JWT_SECRET,
        { expiresIn: "10h" } // long expiration
    );

    res.json({ token });
});

/* =============================================
   VULNERABLE: Missing auth check
============================================= */
app.get("/admin", (req, res) => {
    res.send("Admin panel - no auth required!");
});

/* =============================================
   Start server
============================================= */
app.listen(3000, () => {
    console.log("Vulnerable demo listening on 3000");
});
