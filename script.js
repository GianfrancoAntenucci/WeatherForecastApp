let cityCoordinates = []; // Array to store city data from CSV

// Function to read and parse the CSV file
function loadCSV() {
    const csvData = `
        52.367,4.904,Amsterdam,Netherlands
        39.933,32.859,Ankara,Turkey
        56.134,12.945,Åstorp,Sweden
        37.983,23.727,Athens,Greece
        54.597,-5.930,Belfast,Northern Ireland
        41.387,2.168,Barcelona,Spain
        52.520,13.405,Berlin,Germany
        46.948,7.447,Bern,Switzerland
        43.263,-2.935,Bilbao,Spain
        50.847,4.357,Brussels,Belgium
        47.497,19.040,Bucharest,Romania
        59.329,18.068,Budapest,Hungary
        51.483,-3.168,Cardiff,Wales
        50.937,6.96,Cologne,Germany
        55.676,12.568,Copenhagen,Denmark
        51.898,-8.475,Cork,Ireland
        53.349,-6.260,Dublin,Ireland
        55.953,-3.188,Edinburgh,Scotland
        43.7696,11.255,Florence,Italy
        50.110,8.682,Frankfurt,Germany        
        43.254,6.637,French Riviera,France
        32.650,-16.908,Funchal,Portugual
        36.140,-5.353,Gibraltar
        57.708,11.974,Gothenburg,Sweden     
        53.548,9.987,Hamburg,Germany
        60.169,24.938,Helsinki,Finland
        39.020,1.482,Ibiza,Spain
        50.450,30.523,Kyiv,Ukraine
        61.115,10.466,Lillehammer,Norway
        38.722,-9.139,Lisbon,Portugual
        51.507,-0.127,London,England      
        40.416,-3.703,Madrid,Spain
        39.695,3.017,Mallorca,Spain
        53.480,-2.242,Manchester,England       
        43.296,5.369,Marseille,France
        27.760,-15.586,Maspalomas,Spain
        45.464,9.190,Milan,Italy
        48.135,11.582,Munich,Germany
        40.851,14.268,Naples,Italy
        43.034,-2.417,Oñati,Spain
        59.913,10.752,Oslo,Norway
        48.856,2.352,Paris,France
        50.075,14.437,Prague,Czech Republic
        64.146,-21.942,Reykjavík,Iceland
        56.879,24.603,Riga,Latvia
        41.902,12.496,Rome,Italy
        39.453,-31.127,Santa Cruz das Flores,Portugual
        28.463,-16.251,Santa Cruz de Tenerife,Spain
        57.273,-6.215,Skye,Scotland
        42.697,23.321,Sofia,Bulgaria
        59.329,18.068,Stockholm,Sweden
        59.437,24.753,Tallinn,Estonia
        18.208,16.373,Vienna,Austria
        52.229,21.012,Warsaw,Poland
        53.961,-1.07,York,England
        47.376,8.541,Zurich,Switzerland
    `;

    const rows = csvData.trim().split('\n');
    cityCoordinates = rows.map(row => {
        const columns = row.split(',');
        return {
            latitude: parseFloat(columns[0]),
            longitude: parseFloat(columns[1]),
            city: columns[2],
            country: columns[3]
        };
    });

    // Populate the dropdown with city names
    const cityDropdown = document.getElementById('city');
    cityCoordinates.forEach(cityData => {
        const option = document.createElement('option');
        option.value = cityData.city;
        option.textContent = `${cityData.city}, ${cityData.country}`;
        cityDropdown.appendChild(option);
    });
}

// Function to fetch weather data based on selected city
async function getWeatherByCity(city) {
    if (!city) {
        console.error('City is not selected');
        return;
    }

    const selectedCityData = cityCoordinates.find(cityData => cityData.city === city);

    if (!selectedCityData) {
        console.error('Invalid city data:', city);
        alert('Please select a valid city from the list');
        return;
    }

    const apiUrl = `https://www.7timer.info/bin/api.pl?lon=${selectedCityData.longitude}&lat=${selectedCityData.latitude}&product=civil&output=json`;

    try {
        const response = await fetch(apiUrl);
        const rawData = await response.text();
        const data = JSON.parse(rawData);

        const weatherData = data.dataseries[0]; 
        const temperature = weatherData.temp2m;
        const cloudCover = weatherData.cloudcover;
        const weather = weatherData.weather;

        // Format the weather description with spaces between words
        const formattedWeather = addSpaceToWeatherDescription(weather);

        document.getElementById("temperature").innerText = `Temperature: ${temperature}°C`;
        document.getElementById("cloudCover").innerText = `Cloud Cover: ${cloudCover}%`;
        document.getElementById("weather").innerText = `Weather: ${formattedWeather}`;

    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Error fetching weather data. Please check the console for details.');
    }
}

// Utility function to add spaces and capitalize words in weather descriptions
function addSpaceToWeatherDescription(description) {
    let formattedDescription = description.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    // Capitalize the first letter of each word
    formattedDescription = formattedDescription.replace(/\b\w/g, (match) => match.toUpperCase());
    
    return formattedDescription;
}

// Function to fetch the graphical weather forecast
function fetchGraphicalWeather() {
    const cityName = document.getElementById("city").value;
    const cityData = cityCoordinates.find(city => city.city === cityName);

    if (!cityData) {
        console.error('Invalid city data:', cityData);
        alert('Please select a valid city from the list');
        return;
    }

    // Corrected API URL
    const apiUrl = `https://www.7timer.info/bin/civillight.php?lon=${cityData.longitude}&lat=${cityData.latitude}&ac=0&lang=en&unit=metric&output=internal&tzshift=0`;

    // Set the image source to the graphical API URL
    const forecastImage = document.getElementById("forecastImage");
    forecastImage.src = apiUrl;
}

// Load the CSV data and populate the dropdown when the page loads
window.onload = loadCSV;
