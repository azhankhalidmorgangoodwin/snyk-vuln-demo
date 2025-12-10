const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const app = express();
app.use(bodyParser.json());

// Vulnerable endpoint – user-controlled input flows into _.merge()
app.post("/merge", (req, res) => {
    const target = {};

    // ❌ Exploitable: user input is merged directly
    _.merge(target, req.body);

    res.json({
        message: "Merged successfully",
        target
    });
});

app.get("/", (req, res) => {
    res.send("Prototype Pollution Demo running");
});

// Demonstrate pollution effect globally
setInterval(() => {
    if ({}.polluted) {
        console.log("⚠️ GLOBAL OBJECT POLLUTED!", {}.polluted);
    }
}, 2000);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
