// CRUD operations on the `events` table of the `college` database
//
// SETUP
//   1. npm install
//   2. mysql -u root -p < schema.sql
//   3. set DB_PASSWORD (or edit the default below) and run:  node app.js
//   4. open http://localhost:3000
const express = require("express");
const mysql = require("mysql8");
const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Komal@123",
    database: process.env.DB_NAME || "college",
    dateStrings: true            // return DATE/TIME as plain strings (no timezone shift)
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL");
});

// Validate body: every field is required except description
function validate(b, needId) {
    const missing = [];
    if (needId && (b.eid === undefined || String(b.eid).trim() === "")) missing.push("Event ID");
    if (!b.name || !String(b.name).trim()) missing.push("Event Name");
    if (!b.time) missing.push("Event Time");
    if (!b.date) missing.push("Event Date");
    if (!b.venue || !String(b.venue).trim()) missing.push("Venue Type");
    return missing.length ? "Please fill: " + missing.join(", ") : null;
}

// GET all events
app.get("/events", (req, res) => {
    db.query("SELECT event_id AS event_id, event_name AS event_name, event_time AS event_time, event_date AS event_date, venue_type AS venue_type, description AS description FROM events ORDER BY event_date, event_time", (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// GET one event
app.get("/events/:eid", (req, res) => {
    db.query("SELECT event_id AS event_id, event_name AS event_name, event_time AS event_time, event_date AS event_date, venue_type AS venue_type, description AS description FROM events WHERE event_id=?", [req.params.eid], (err, result) => {
        if (err) return res.status(500).send(err.message);
        res.json(result);
    });
});

// INSERT
app.post("/events", (req, res) => {
    const problem = validate(req.body, true);
    if (problem) return res.status(400).send(problem);
    const { eid, name, time, date, venue, description } = req.body;
    db.query(
        "INSERT INTO events(event_id,event_name,event_time,event_date,venue_type,description) VALUES(?,?,?,?,?,?)",
        [eid, name.trim(), time, date, venue.trim(), (description || "").trim() || null],
        (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") return res.status(409).send("Event ID already exists");
                return res.status(500).send(err.message);
            }
            res.send("Event Inserted");
        });
});

// UPDATE
app.put("/events/:eid", (req, res) => {
    const problem = validate(req.body, false);
    if (problem) return res.status(400).send(problem);
    const { name, time, date, venue, description } = req.body;
    db.query(
        "UPDATE events SET event_name=?, event_time=?, event_date=?, venue_type=?, description=? WHERE event_id=?",
        [name.trim(), time, date, venue.trim(), (description || "").trim() || null, req.params.eid],
        (err, result) => {
            if (err) return res.status(500).send(err.message);
            if (result.affectedRows == 0) return res.status(404).send("Event NOT found");
            res.send("Event Updated");
        });
});

// DELETE
app.delete("/events/:eid", (req, res) => {
    db.query("DELETE FROM events WHERE event_id=?", [req.params.eid], (err, result) => {
        if (err) return res.status(500).send(err.message);
        if (result.affectedRows == 0) return res.status(404).send("Event NOT found to delete");
        res.send("Event Deleted");
    });
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});