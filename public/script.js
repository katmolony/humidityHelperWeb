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
    const channelID = '2369829'; // Replace with your ThingSpeak channel ID
    const apiKey = '75U1406FS2G9BFG8'; // Replace with your ThingSpeak API key

    const urlField1 = `https://api.thingspeak.com/channels/${channelID}/fields/1.json?api_key=${apiKey}&results=10`;
    const urlField2 = `https://api.thingspeak.com/channels/${channelID}/fields/2.json?api_key=${apiKey}&results=10`;

    try {
        const responseField1 = await fetch(urlField1);
        const dataField1 = await responseField1.json();

        const responseField2 = await fetch(urlField2);
        const dataField2 = await responseField2.json();

        // Process dataField1 and dataField2 to create datasets for the chart
        const labels = dataField1.feeds.map(feed => feed.created_at);
        const valuesField1 = dataField1.feeds.map(feed => feed.field1);
        const valuesField2 = dataField2.feeds.map(feed => feed.field2);

        // Create a chart using Chart.js
        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Field 1',
                        data: valuesField1,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Field 2',
                        data: valuesField2,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                },
            },
        });
    } catch (error) {
        console.error('Error fetching data from ThingSpeak:', error);
    }
}

// Call the fetchData function when the page loads
document.addEventListener('DOMContentLoaded', fetchData);


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
