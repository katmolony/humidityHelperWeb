const express = require('express');
const sqlite3 = require('sqlite3');
const app = express();
const port = process.env.PORT || 3000;

// Create SQLite database
const db = new sqlite3.Database('data.db');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Close the database connection when the server is stopped
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Database connection closed');
        process.exit(0);
    });
});

// Example: Assuming you have an endpoint to receive ThingSpeak data
app.post('/receive-thingspeak-data', (req, res) => {
    // Your existing code to process ThingSpeak data...

    // Create the 'data' table if it doesn't exist
    db.run('CREATE TABLE IF NOT EXISTS data (timestamp DATETIME, value INTEGER)');

    // Insert data into the 'data' table (replace timestamp and value with actual data)
    const timestamp = new Date(); // Replace this with the actual timestamp
    const value = 42; // Replace this with the actual value
    db.run('INSERT INTO data (timestamp, value) VALUES (?, ?)', [timestamp, value], (err) => {
        if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted into the database');
            res.status(200).send('Data received and stored successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
