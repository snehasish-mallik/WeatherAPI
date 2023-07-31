const https = require('https');

const API_URL = "https://samples.openweathermap.org/data/2.5/forecast/hourly?q=London,us&appid=b6907d289e10d714a6e88b30761fae22";

function getWeatherData() {
    return new Promise((resolve, reject) => {
        https.get(API_URL, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                try {
                    const weatherData = JSON.parse(data);
                    resolve(weatherData.list);
                } catch (error) {
                    console.error("Failed to parse weather data.", error);
                    resolve([]);
                }
            });
        }).on('error', (error) => {
            console.error("Failed to fetch weather data.", error);
            resolve([]);
        });
    });
}


function getTemp(date) {
    return getWeatherData()
        .then(weatherData => {
            for (const data of weatherData) {
                if (data.dt_txt.startsWith(date)) {
                    return data.main.temp;
                }
            }
            return null;
        });
}

function getWindSpeed(date) {
    return getWeatherData()
        .then(weatherData => {
            for (const data of weatherData) {
                if (data.dt_txt.startsWith(date)) {
                    return data.wind.speed;
                }
            }
            return null;
        });
}

function getPressure(date) {
    return getWeatherData()
        .then(weatherData => {
            for (const data of weatherData) {
                if (data.dt_txt.startsWith(date)) {
                    return data.main.pressure;
                }
            }
            return null;
        });
}

async function main() {
    while (true) {
        console.log("\n1. Get weather\n2. Get Wind Speed\n3. Get Pressure\n0. Exit");
        const choice = await prompt("Enter your choice: ");

        if (choice === "1") {
            const date = await prompt("Enter the date (YYYY-MM-DD): ");
            const temp = await getTemp(date);
            if (temp !== null) {
                console.log(`Temperature on ${date}: ${temp} Kelvin`);
            } else {
                console.log("No data available for the specified date.");
            }
        } else if (choice === "2") {
            const date = await prompt("Enter the date (YYYY-MM-DD): ");
            const windSpeed = await getWindSpeed(date);
            if (windSpeed !== null) {
                console.log(`Wind Speed on ${date}: ${windSpeed} m/s`);
            } else {
                console.log("No data available for the specified date.");
            }
        } else if (choice === "3") {
            const date = await prompt("Enter the date (YYYY-MM-DD): ");
            const pressure = await getPressure(date);
            if (pressure !== null) {
                console.log(`Pressure on ${date}: ${pressure} hPa`);
            } else {
                console.log("No data available for the specified date.");
            }
        } else if (choice === "0") {
            console.log("Exiting the program.");
            break;
        } else {
            console.log("Invalid choice. Please try again.");
        }
    }
}

function prompt(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            readline.close();
            resolve(answer);
        });
    });
}

main();
