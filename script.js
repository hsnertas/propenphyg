$(document).ready(function () {

    // Cities
    var cityHistory = ["Eskisehir", "New york", "Chicago", "London", "Wellington", "Cliffside Park"];

    // Update  local storage
    function StorageCheck() {
        // Local storage get item
        var storedCities = JSON.parse(localStorage.getItem("history"));
        if (storedCities !== null) {
            cityHistory = storedCities;
        }
        renderButtons();
    }

    // Search button click event
    $(".searchButton").on("click", function () {
        var search = $(".searchInput").val();
        cityHistory.push(search);
        // Local storage set item
        localStorage.setItem("history", JSON.stringify(cityHistory))
        weather(search);
        StorageCheck();
    });

    function renderButtons() {

        // Making buttons
        $("#BtnDiv").html("");
        for (var i = 0; i < cityHistory.length; i++) {
            var city = cityHistory[i];
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-primary history");
            newBtn.attr("data-name", city);
            newBtn.attr("id", "cityBtn");
            newBtn.text(city);
            $("#BtnDiv").prepend(newBtn);
        }
    }

    // Button click event
    $("#BtnDiv").on("click", "button", function (event) {
        event.preventDefault();
        clickedCity = $(this).attr("data-name");
        console.log(clickedCity);
        weather(clickedCity)
    })

    // Weather funtion
    function weather(searchInput) {

        // Current weather URL
        var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=0f548c8ee942c746944a0b61a38984b0&units=imperial";
        // Five days weather URL
        var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=0f548c8ee942c746944a0b61a38984b0&units=imperial";


        $.ajax({
            url: urlCurrent,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            $(".list-group").append("<li>" + response.name + "</li>");
            // Local storage

            // Start Current Weather append 
            var currentCard = $(".currentCard").append("<div>").addClass("card-body");
            currentCard.empty();
            var timeUTC = new Date(response.dt * 1000);
            currentCard.append("<p class='date'>" + timeUTC.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + "</p>");
            currentCard.append("<div>" + "<p class='tempP'>" + "<span class=' temp'>" + (response.main.temp).toFixed(0) + "°F" + "</span>" + "<span>" + `<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">` + "</span>" + "<span class='citySpan'>" + response.name + ", " + response.sys.country + "</span>" + "</p>" + "<p class='description'>" + response.weather[0].description + "</p>" + "<div>");
            currentCard.append("<p>" + "Humidity: " + response.main.humidity + "%" + "</p>");
            currentCard.append("<p>" + "Wind Speed: " + (response.wind.speed).toFixed(1) + " MPH" + "</p>");

            // Change backgroudn image
            switch (response.weather[0].main) {
                case 'Clear':
                    document.body.style.backgroundImage = "url('assets/clear.jpg')";
                    break;
                case 'Clouds':
                    document.body.style.backgroundImage = "url('assets/cloudy.jpg')";
                    break;
                case 'Rain':
                case 'Drizzle':
                case 'Mist':
                    document.body.style.backgroundImage = "url('assets/rainy.jpg')";
                    break;
                case 'Thunderstorm':
                    document.body.style.backgroundImage = "url('assets/storm.jpg')";
                    break;
                case 'Snow':
                    document.body.style.backgroundImage = "url('assets/snow.jpg')";
                    break;

                default:
                    break;

            }



            // UV Index URL
            var urlUV = `https://api.openweathermap.org/data/2.5/uvi?appid=0f548c8ee942c746944a0b61a38984b0&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            $.ajax({
                url: urlUV,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                var uv = response.value
                currentCard.append("<p>" + "UV Index: " + "<strong>" + uv + "</strong>" + "</p>");

                $("strong").addClass("uvSpan");
                //uvModerate   uvFavorable uvModerate

                if (uv > 8) {
                    $("strong").addClass("uvSevere");
                    $("strong").removeClass("uvFavorable");
                    $("strong").removeClass("uvModerate");
                }
                else if (uv < 8 && uv > 3) {
                    $("strong").addClass("uvModerate");
                    $("strong").removeClass("uvFavorable");
                    $("strong").removeClass("uvSevere");

                }
                else if (uv < 3) {
                    $("strong").addClass("uvFavorable");
                    $("strong").removeClass("uvModerate");
                    $("strong").removeClass("uvSevere");
                }
            });

        });

        // 5-day forecast 
        $.ajax({
            url: urlFiveDay,
            method: "GET"
        }).then(function (response) {
            // Array for 5-days 
            var day = [8, 16, 24, 32, 39];
            var fiveDayCard = $(".fiveDayCard").addClass("card-body");
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text");
            fiveDayDiv.empty();
            // For each for 5 days
            day.forEach(function (i) {
                var FiveDayTimeUTC1 = new Date(response.list[i].dt * 1000);
                FiveDayTimeUTC1 = FiveDayTimeUTC1.toLocaleDateString("en-US", { weekday: 'long' });
                fiveDayDiv.append("<div class=fiveDayColor>" + "<p>" + FiveDayTimeUTC1 + "</p>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temperature: " + (response.list[i].main.temp).toFixed(0) + "°F" + "</p>" + "<p>" + "Humidity: " + response.list[i].main.humidity + "%" + "</p>" + "</div>");
            })
        });

    };
    renderButtons();
    StorageCheck()
});