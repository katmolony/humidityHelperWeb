const fetch = require("node-fetch").default;
const express = require("express");
const { Client } = require("pg");
const app = express();
const port = process.env.PORT || 3000;

// Connection details from ElephantSQL
const connectionString =
  "postgres://vieojjcc:9JXsf3IHhs4svPAzV5MpktYU5c-BV4H7@mel.db.elephantsql.com/vieojjcc";
const client = new Client({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Connect to the PostgreSQL database
client.connect();

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS temperature_data (
    timestamp TIMESTAMP,
    indoor_temperature REAL,
    outdoor_temperature REAL
  );

  CREATE TABLE IF NOT EXISTS humidity_data (
    timestamp TIMESTAMP,
    indoor_humidity REAL,
    outdoor_humidity REAL
  );
  CREATE TABLE IF NOT EXISTS dewPoint_data (
  timestamp TIMESTAMP,
  indoor_dew_point REAL,
  outdoor_dew_point REAL
);

INSERT INTO dewPoint_data (timestamp, indoor_dew_point, outdoor_dew_point)
SELECT
  t.timestamp,
  ROUND(
    (
      237.7 * (
        (17.27 * t.indoor_temperature) /
        (237.7 + t.indoor_temperature) +
        LOG(h.indoor_humidity / 100.0)
      )
    ) /
    (17.27 - (
      (17.27 * t.indoor_temperature) /
      (237.7 + t.indoor_temperature) +
      LOG(h.indoor_humidity / 100.0)
    )),
    1
  ) AS indoor_dew_point,
  ROUND(
    (
      237.7 * (
        (17.27 * t.outdoor_temperature) /
        (237.7 + t.outdoor_temperature) +
        LOG(h.outdoor_humidity / 100.0)
      )
    ) /
    (17.27 - (
      (17.27 * t.outdoor_temperature) /
      (237.7 + t.outdoor_temperature) +
      LOG(h.outdoor_humidity / 100.0)
    )),
    1
  ) AS outdoor_dew_point
FROM
  temperature_data t
JOIN humidity_data h ON t.timestamp = h.timestamp;

`;
client.query(createTableQuery, (err) => {
  if (err) {
    console.error("Error creating table:", err);
    client.end();
  } else {
    console.log("Table created successfully");
  }
});

app.post("/receive-thingspeak-data", async (req, res) => {
  try {
    console.log("Fetching data from ThingSpeak...");

    // Fetch data from ThingSpeak using built-in fetch
    const apiUrl =
      "https://api.thingspeak.com/channels/2369829/feeds.json?api_key=75U1406FS2G9BFG8&results=10";
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Check if the 'feeds' array is not empty
    if (data && data.feeds && data.feeds.length > 0) {
      // Extract data from ThingSpeak response
      const indoorTemperature = parseFloat(data.feeds[0].field1);
      const outdoorTemperature = parseFloat(data.feeds[0].field4);
      const indoorHumidity = parseFloat(data.feeds[0].field2);
      const outdoorHumidity = parseFloat(data.feeds[0].field5);
      const timestamp = new Date(data.feeds[0].created_at);

      if (
        !isNaN(indoorTemperature) &&
        !isNaN(outdoorTemperature) &&
        !isNaN(indoorHumidity) &&
        !isNaN(outdoorHumidity)
      ) {
      } else {
        console.error("Invalid temperature or humidity values");
        res.status(500).send("Internal Server Error");
      }

      // Insert data into the 'temperature_data' table

      const insertTemperatureQuery = `INSERT INTO temperature_data (timestamp, indoor_temperature, outdoor_temperature) VALUES ('${timestamp.toISOString()}', ${parseFloat(
        indoorTemperature
      )}, ${parseFloat(outdoorTemperature)})`;
      await client.query(insertTemperatureQuery);

      // Insert data into the 'humidity_data' table
      const insertHumidityQuery = `INSERT INTO humidity_data (timestamp, indoor_humidity, outdoor_humidity) VALUES ('${timestamp.toISOString()}', ${parseFloat(
        indoorHumidity
      )}, ${parseFloat(outdoorHumidity)})`;
      await client.query(insertHumidityQuery);

      console.log("Data inserted into temperature and humidity tables");
      res.status(200).send("Data received and stored successfully");
    } else {
      console.error('No data received from ThingSpeak or empty "feeds" array');
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Error processing ThingSpeak data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/average-temperature", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight

    const query =
      "SELECT AVG(indoor_temperature) AS average_temperature FROM temperature_data WHERE timestamp >= $1";
    const result = await client.query(query, [today]);

    const averageTemperature = result.rows[0].average_temperature;

    res.json({ averageTemperature });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/average-outdoor-temperature", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT AVG(outdoor_temperature) AS average_outdoor_temperature FROM temperature_data"
    );
    const averageOutdoorTemperature =
      result.rows[0].average_outdoor_temperature;

    res.json({ averageOutdoorTemperature });
  } catch (error) {
    console.error("Error fetching average outdoor temperature:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for fetching average indoor humidity
app.get("/average-indoor-humidity", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT AVG(indoor_humidity) AS average_indoor_humidity FROM humidity_data"
    );
    const averageIndoorHumidity = result.rows[0].average_indoor_humidity;

    res.json({ averageIndoorHumidity });
  } catch (error) {
    console.error("Error fetching average indoor humidity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for fetching average outdoor humidity
app.get("/average-outdoor-humidity", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT AVG(outdoor_humidity) AS average_outdoor_humidity FROM humidity_data"
    );
    const averageOutdoorHumidity = result.rows[0].average_outdoor_humidity;

    res.json({ averageOutdoorHumidity });
  } catch (error) {
    console.error("Error fetching average outdoor humidity:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/average-indoor-dew-point", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT AVG(indoor_dew_point) AS average_indoor_dew_point FROM dewPoint_data"
    );
    const averageIndoorDewPoint = result.rows[0].average_indoor_dew_point;

    res.json({ averageIndoorDewPoint });
  } catch (error) {
    console.error("Error fetching average indoor dew point:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/average-outdoor-dew-point", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT AVG(outdoor_dew_point) AS average_outdoor_dew_point FROM dewPoint_data"
    );
    const averageOutdoorDewPoint = result.rows[0].average_outdoor_dew_point;

    res.json({ averageOutdoorDewPoint });
  } catch (error) {
    console.error("Error fetching average outdoor dew point:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use((req, res, next) => {
  console.log(`Received request at ${req.method} ${req.url}`);
  next();
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Close the database connection when the server is stopped
process.on("SIGINT", () => {
  client.end(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
