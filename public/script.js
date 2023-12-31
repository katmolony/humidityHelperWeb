/*
  This is your site JavaScript code - you can add interactivity!
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

// change the channel id and API
const apiUrl = 'https://api.thingspeak.com/channels/2369829/feeds.json?api_key=75U1406FS2G9BFG8&results=10';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Process the data and update your charts
        console.log(data);
    })
    .catch(error => console.error('Error fetching data:', error));

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the steps in the TODO 🚧
*/
const btn = document.querySelector("button"); // Get the button from the page
if (btn) { // Detect clicks on the button
  btn.onclick = function () {
    // The 'dipped' class in style.css changes the appearance on click
    btn.classList.toggle("dipped");
  };
}

// Function to fetch data from ThingSpeak
async function fetchData() {
  const channelID = "2369829"; // Replace with your ThingSpeak channel ID
  const apiKey = "75U1406FS2G9BFG8"; // Replace with your ThingSpeak API key

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
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Today's Temperature",
            font: {
              size: 16,
            },
          },
        },
      },
    });

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
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Today's Humidity",
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
        scales: {
          x: {
            type: "category",
          },
        },
        plugins: {
          title: {
            display: true,
            text: "Today's Pressure",
            font: {
              size: 16,
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error fetching data from ThingSpeak:", error);
  }
}

// Call the fetchData function when the page loads
document.addEventListener("DOMContentLoaded", fetchData);

// ----- GLITCH STARTER PROJECT HELPER CODE -----

// Open file when the link in the preview is clicked
let goto = (file, line) => {
  window.parent.postMessage(
    { type: "glitch/go-to-line", payload: { filePath: file, line: line } }, "*"
  );
};
// Get the file opening button from its class name
const filer = document.querySelectorAll(".fileopener");
filer.forEach((f) => {
  f.onclick = () => { goto(f.dataset.file, f.dataset.line); };
});
