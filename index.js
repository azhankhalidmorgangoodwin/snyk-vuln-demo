const express = require("express");
const minimist = require("minimist");
const _ = require("lodash");
const axios = require("axios");

const app = express();

const args = minimist(process.argv.slice(2));

app.get("/", async (req, res) => {
    res.send("Vulnerable Snyk Demo is running.");
});

const polluted = _.merge({}, JSON.parse('{"__proto__": {"pwned": "yes"}}'));
console.log("Prototype polluted? ->", {}.pwned);

async function vulnerableRequest() {
    try {
        const result = await axios.get("http://example.com");
        console.log(result.status);
    } catch (e) {
        console.log("Request failed");
    }
}
vulnerableRequest();

app.listen(3000, () => {
    console.log("Running on port 3000");
});