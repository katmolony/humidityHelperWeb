// change the channel id and API
const apiUrl =
  "https://api.thingspeak.com/channels/2369829/feeds.json?api_key=75U1406FS2G9BFG8&results=10";

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Process the data and update your charts
    const indoorTemperature = data.feeds[0].field1; // Adjust the index if needed
    const outdoorTemperature = data.feeds[0].field4; // Adjust the index if needed
    const indoorHumidity = data.feeds[0].field2; // Adjust the index if needed
    const outdoorHumidity = data.feeds[0].field5; // Adjust the index if needed

    console.log(data);
  })
  .catch((error) => console.error("Error fetching data:", error));

const channelID = "2369829"; // Replace with your ThingSpeak channel ID
const apiKey = "75U1406FS2G9BFG8"; // Replace with your ThingSpeak API key
//  const apiKey = process.env.API_KEY;

// Function to fetch data from ThingSpeak
async function fetchData(callback) {
  const urlField1 = `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=${apiKey}&results=10`;
  const urlField4 = `https://api.thingspeak.com/channels/${channelID}/fields/4.json?api_key=${apiKey}&results=10`;

  const urlHumidityField2 = `https://api.thingspeak.com/channels/${channelID}/fields/2.json?api_key=${apiKey}&results=10`;
  const urlHumidityField5 = `https://api.thingspeak.com/channels/${channelID}/fields/5.json?api_key=${apiKey}&results=10`;

  const urlPressureField3 = `https://api.thingspeak.com/channels/${channelID}/fields/3.json?api_key=${apiKey}&results=10`;
  const urlPressureField6 = `https://api.thingspeak.com/channels/${channelID}/fields/6.json?api_key=${apiKey}&results=10`;

  try {
    const responseField1 = await fetch(urlField1);
    const dataField1 = await responseField1.json();

    const responseField4 = await fetch(urlField4);
    const dataField4 = await responseField4.json();

    // Extract timestamp and values for both fields
    const timestamps = dataField1.feeds.map((feed) => moment(feed.created_at));
    const valuesField1 = dataField1.feeds.map((feed) => feed.field1);
    const valuesField4 = dataField4.feeds.map((feed) => feed.field4);

    const responseHumidityField2 = await fetch(urlHumidityField2);
    const dataHumidityField2 = await responseHumidityField2.json();

    const responseHumidityField5 = await fetch(urlHumidityField5);
    const dataHumidityField5 = await responseHumidityField5.json();

    // Extract timestamp and values for both humidity fields
    const timestampsHumidity = dataHumidityField2.feeds.map((feed) =>
      moment(feed.created_at)
    );
    const valuesHumidityField2 = dataHumidityField2.feeds.map(
      (feed) => feed.field2
    );
    const valuesHumidityField5 = dataHumidityField5.feeds.map(
      (feed) => feed.field5
    );

    const responsePressureField3 = await fetch(urlPressureField3);
    const dataPressureField3 = await responsePressureField3.json();

    const responsePressureField6 = await fetch(urlPressureField6);
    const dataPressureField6 = await responsePressureField6.json();

    // Extract timestamp and values for both pressure fields
    const timestampsPressure = dataPressureField3.feeds.map((feed) =>
      moment(feed.created_at)
    );
    const valuesPressureField3 = dataPressureField3.feeds.map(
      (feed) => feed.field3
    );
    const valuesPressureField6 = dataPressureField6.feeds.map(
      (feed) => feed.field6
    );

    // Create a chart using Chart.js
    const ctxTemp = document.getElementById("tempChart").getContext("2d");
    const tempChart = new Chart(ctxTemp, {
      type: "line",
      data: {
        labels: timestamps.map((ts) => ts.format("HH:mm:ss")),
        datasets: [
          {
            label: "Indoor Temperature",
            data: valuesField1,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Outdoor Temperature",
            data: valuesField4,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Add this line
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Current Temperature",
            font: {
              size: 16,
            },
          },
        },
      },
    });

    // Define a function to fetch data and update charts
    async function fetchDataAndUpdateCharts() {
      // Your existing code for fetching data and updating charts
      // ...

      console.log("Data fetched and charts updated at", new Date());
    }

    // Call the function immediately when the page loads
    document.addEventListener("DOMContentLoaded", fetchDataAndUpdateCharts);

    // Set up periodic data fetching every 5 minutes (300,000 milliseconds)
    setInterval(fetchDataAndUpdateCharts, 30000);

    // Create a humidity chart using Chart.js
    const ctxHumidity = document
      .getElementById("humidityChart")
      .getContext("2d");
    const humidityChart = new Chart(ctxHumidity, {
      type: "line",
      data: {
        labels: timestampsHumidity.map((ts) => ts.format("HH:mm:ss")),
        datasets: [
          {
            label: "Indoor Humidity",
            data: valuesHumidityField2,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Outdoor Humidity",
            data: valuesHumidityField5,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Add this line
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Current Humidity",
            font: {
              size: 16,
            },
          },
        },
      },
    });

    // Create a pressure chart using Chart.js
    const ctxPressure = document
      .getElementById("pressureChart")
      .getContext("2d");
    const pressureChart = new Chart(ctxPressure, {
      type: "line",
      data: {
        labels: timestampsPressure.map((ts) => ts.format("HH:mm:ss")),
        datasets: [
          {
            label: "Indoor Pressure",
            data: valuesPressureField3,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
          {
            label: "Outdoor Pressure",
            data: valuesPressureField6,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        maintainAspectRatio: false, // Add this line
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Current Pressure",
            font: {
              size: 16,
            },
          },
        },
      },
    });

    // Calculate Dew Point
    const dewPointField1 = valuesField1.map((temp, index) => {
      const humidity = valuesHumidityField2[index];
      return temp - (100 - humidity) / 5;
    });

    // Create a chart using Chart.js for Dew Point
    const ctxDewPoint = document
      .getElementById("dewPointChart")
      .getContext("2d");
    const dewPointChart = new Chart(ctxDewPoint, {
      type: "line",
      data: {
        labels: timestamps
          .filter((ts) => ts.isAfter(moment().subtract(6, "hours")))
          .map((ts) => ts.unix()),
        datasets: [
          {
            label: "Dew Point",
            data: dewPointField1,
            borderColor: "rgba(255, 206, 86, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            ticks: {
              maxTicksLimit: 10,
              callback: function (value, index, values) {
                return moment.unix(value).utc().format("HH:mm:ss");
              },
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Last 6 Hours Dew Point",
            font: {
              size: 16,
            },
          },
        },
      },
    });

    // Indoor dew point calculation
    // Calculate Risk of Indoor Humidity
    const humidityRiskField2 = valuesHumidityField2.map((humidity) => {
      if (humidity < 30) {
        return "Low Humidity";
      } else if (humidity > 60) {
        return "High Humidity";
      } else {
        return "Normal Humidity";
      }
    });

    // 1. Calculate Dew Point
    const calculateDewPoint = (temperature, humidity) => {
      return temperature - (100 - humidity) / 5;
    };

    const indoorDewPoint = calculateDewPoint(indoorTemperature, indoorHumidity);
    const outdoorDewPoint = calculateDewPoint(
      outdoorTemperature,
      outdoorHumidity
    );

    // 2. Calculate Temperature Difference
    const temperatureDifference = indoorTemperature - outdoorTemperature;

    // 3. Compare Indoor Temperature and Dew Point
    const isRiskOfCondensation = indoorTemperature <= indoorDewPoint;

    // 4. Relative Humidity Threshold
    const relativeHumidityThreshold = 60; // Adjust as needed
    const isHighRelativeHumidity = indoorHumidity > relativeHumidityThreshold;

    // 5. Temperature Difference Threshold
    const temperatureDifferenceThreshold = 5; // Adjust as needed
    const isExceedingTemperatureDifference =
      temperatureDifference > temperatureDifferenceThreshold;

    // // Get the HTML box element
    const warningBox = document.getElementById("warningBox");

    // 6. Alert System (Console Log for demonstration purposes, implement notifications or other alerts as needed)
    if (
      isRiskOfCondensation ||
      isHighRelativeHumidity ||
      isExceedingTemperatureDifference
    ) {
      console.log("Warning: Risk of condensation! Check indoor conditions.");
    } else {
      console.log("Indoor conditions are within acceptable limits.");
    }
    // Call the callback to signal that data fetching is complete
    callback();
  } catch (error) {
    console.error("Error fetching data from ThingSpeak:", error);
  }
}

// // Function to update the warning box
// function updateWarningBox() {
//   // Get the HTML box element
//   const warningBox = document.getElementById("warningBox");

//   // Check conditions and update content
//   if (
//     isRiskOfCondensation ||
//     isHighRelativeHumidity ||
//     isExceedingTemperatureDifference
//   ) {
//     const warnings = [];
//     if (isRiskOfCondensation) {
//       warnings.push("Risk of condensation!");
//     }
//     if (isHighRelativeHumidity) {
//       warnings.push("High relative humidity!");
//     }
//     if (isExceedingTemperatureDifference) {
//       warnings.push("Exceeding temperature difference!");
//     }

//     // Display warnings in the box
//     warningBox.innerHTML = `<strong>Warnings:</strong><br>${warnings.join(
//       "<br>"
//     )}`;
//   } else {
//     // Display everything is okay
//     warningBox.innerHTML = "<strong>Everything is okay!</strong>";
//   }
// }

// // Call the fetchData function when the page loads
// document.addEventListener("DOMContentLoaded", async () => {
//   await fetchData();
//   updateWarningBox(); // Update the warning box after fetching data
// });

// Call the fetchData function when the page loads
document.addEventListener("DOMContentLoaded", fetchData);

//function sending data to elephant SQL
fetch("/receive-thingspeak-data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch and display average temperature
  async function fetchAverageTemperature() {
    try {
      const indoorResponse = await fetch("/average-temperature");
      const outdoorResponse = await fetch("/average-outdoor-temperature");

      const indoorData = await indoorResponse.json();
      const outdoorData = await outdoorResponse.json();

      if (indoorResponse.ok && outdoorResponse.ok) {
        const averageIndoorTemperature = Number(
          indoorData.averageTemperature
        ).toFixed(1);
        const averageOutdoorTemperature = Number(
          outdoorData.averageOutdoorTemperature
        ).toFixed(1);

        document.getElementById(
          "averageTemperature"
        ).innerText = `Average Indoor: ${averageIndoorTemperature} °C`;
        document.getElementById(
          "averageOutdoorTemperature"
        ).innerText = `Average Outdoor: ${averageOutdoorTemperature} °C`;
      } else {
        console.error(
          "Error fetching average temperature:",
          indoorData.error || outdoorData.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch average temperature when the page is loaded
  fetchAverageTemperature();

  setInterval(fetchAverageTemperature, 300000); // Fetch every 5 minutes (300,000 milliseconds)

  async function fetchAverageHumidity() {
    try {
      const indoorResponse = await fetch("/average-indoor-humidity");
      const outdoorResponse = await fetch("/average-outdoor-humidity");

      const indoorData = await indoorResponse.json();
      const outdoorData = await outdoorResponse.json();

      if (indoorResponse.ok && outdoorResponse.ok) {
        const averageIndoorHumidity = Number(
          indoorData.averageIndoorHumidity
        ).toFixed(1);
        const averageOutdoorHumidity = Number(
          outdoorData.averageOutdoorHumidity
        ).toFixed(1);

        document.getElementById(
          "averageHumidity"
        ).innerText = `Average Indoor: ${averageIndoorHumidity} %`;
        document.getElementById(
          "averageOutdoorHumidity"
        ).innerText = `Average Outdoor: ${averageOutdoorHumidity} %`;
      } else {
        console.error(
          "Error fetching average humidity:",
          indoorData.error || outdoorData.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch average humidity when the page is loaded
  fetchAverageHumidity();

  setInterval(fetchAverageHumidity, 300000); // Fetch every 5 minutes (300,000 milliseconds)

  async function fetchAverageDewPoint() {
    try {
      const indoorResponse = await fetch("/average-indoor-dew-point");
      const outdoorResponse = await fetch("/average-outdoor-dew-point");

      const indoorData = await indoorResponse.json();
      const outdoorData = await outdoorResponse.json();

      if (indoorResponse.ok && outdoorResponse.ok) {
        const averageIndoorDewPoint = Number(
          indoorData.averageIndoorDewPoint
        ).toFixed(1);
        const averageOutdoorDewPoint = Number(
          outdoorData.averageOutdoorDewPoint
        ).toFixed(1);

        document.getElementById(
          "averageDewPoint"
        ).innerText = `Average Indoor: ${averageIndoorDewPoint} °C`;
        document.getElementById(
          "averageOutdoorDewPoint"
        ).innerText = `Average Outdoor: ${averageOutdoorDewPoint} °C`;
      } else {
        console.error(
          "Error fetching average dew point:",
          indoorData.error || outdoorData.error
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch average dew point when the page is loaded
  fetchAverageDewPoint();

  setInterval(fetchAverageDewPoint, 300000); // Fetch every 5 minutes
});

// Call the fetchData function when the page loads
document.addEventListener("DOMContentLoaded", fetchData);

// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } },
    "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => {
    goto(f.dataset.file, f.dataset.line);
  };
});
