async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching countries:', error);
        return [];
    }
}

function saveToLocalStorage(data) {
    localStorage.setItem('countriesData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem('countriesData');
    return JSON.parse(data);
}



function displayCountryInfo(countriesData) {
    let datalist = document.getElementById('country');
    countriesData.forEach(country => {
        let option = document.createElement('option');
        option.textContent = country.name.common;
        datalist.appendChild(option)
    });
}


async function initializeApp() {
    let countriesData = loadFromLocalStorage();

    if (!countriesData) {
        countriesData = await fetchCountries();
        saveToLocalStorage(countriesData);
    }


    displayCountryInfo(countriesData);
    $('#country').select2().on('change', function() {
        const selectedCountry = countriesData.find(country => country.name.common === $(this).val());
        if (selectedCountry) {
            displaySelectedCountryInfo(selectedCountry);
        }
    });
}

function displaySelectedCountryInfo(country) {
    document.getElementById('country').value = '';



    const countryName = country.name.common;
    const officialName = country.name.official;
    const capital = country.capital ? country.capital[0] : 'N/A';
    const region = country.region;
    const subRegion = country.subregion;
    

    const img = country.flags.png;
    const coat = country.coatOfArms.svg;

    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const population = country.population ? country.population.toLocaleString() : 'N/A';
    const area = country.area ? country.area.toLocaleString() + ' sq.km' : 'N/A';
    const googleMaps = country.maps ? country.maps.googleMaps : '#';
    const openStreetMaps = country.maps ? country.maps.openStreetMaps : '#';
    const timezones = country.timezones ? Object.values(country.timezones).join(', ') : 'N/A';
    document.querySelectorAll('.links a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            const url = this.href;
            window.open(url, '_blank');
        });
    });



    document.querySelector('.country-details h1').textContent = countryName;
    document.querySelector('.country-details strong').innerHTML = "<strong>Official name:</strong>" + ` ${officialName}`;
    document.querySelector('.capital').innerHTML = "<strong>Capital:</strong>" + ` ${capital}`;
    document.querySelector('.region').innerHTML = "<strong>Region:</strong>" + ` ${region}`;
    document.querySelector('.Subregion').innerHTML = "<strong>Subregion:</strong>" + ` ${subRegion}`;

    document.getElementById('flag-img').src = img;
    document.getElementById('arms-img').src = coat;

    document.querySelector('.languages').innerHTML = "<strong>Languages:</strong>" + ` ${languages}`;
    document.querySelector('.population').innerHTML = "<strong>Population:</strong>" + ` ${population}`;
    document.querySelector('.area').innerHTML = "<strong>Area:</strong>" + ` ${area}`;
    document.querySelector('.google-maps').href = googleMaps;
    document.querySelector('.street-maps').href = openStreetMaps ;
    document.querySelector('.timezones').innerHTML = "<strong>Timezones:</strong>" + ` ${timezones}`;
}

document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});