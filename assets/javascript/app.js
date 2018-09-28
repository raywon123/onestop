var config = {
    apiKey: "AIzaSyCXn1sbvI8TkwpdQuURWkamAsfmNpencYA",
    authDomain: "project1auth.firebaseapp.com",
    databaseURL: "https://project1auth.firebaseio.com",
    projectId: "project1auth",
    storageBucket: "project1auth.appspot.com",
    messagingSenderId: "658376280287"
};
firebase.initializeApp(config);

//variables
let database = firebase.database();
let data;
let datepick = "";
let dateUsed = moment().format('YYYY-MM-DDTHH:mm');
let movieDateUsed = moment(dateUsed).format('YYYY-MM-DD');
console.log(dateUsed);
console.log(movieDateUsed);

let food_limit = 10;
let foodObject = {};

let meetupObject = [];
let movieObject = {};
let omdbObject = [];

let lat_meetup = "30.299699783325195";
let lon_meetup = "-97.7223892211914";
let lat = lat_meetup;
let lon = lon_meetup;
let isMeetupChosen = false;

let clickedObject = {};
let databaseObject = [];

function initialApp() {
    $("#food").empty();
    $("#meetups").empty();
    $("#movies").empty();
    $(".addBtn").hide();
    searchZomato("Austin", lat, lon);
    meetupApi(dateUsed);
    movieApi(movieDateUsed);
}

$(document).ready(function () {
    // meetupApi(dateUsed);
    // movieDateUsed = moment(dateUsed).format('YYYY-MM-DD');
    // movieApi(movieDateUsed);
    initialApp();

    // $('#food').on('click', function () {
    //     console.log('food clicked');
    //     //set up ajax function for pulling restaurant data
    //     //change button color to show active
    // })

    // Daynamically created Buttons clicked - food, meetup, movies - begins

    $("#food").on("click", ".foodchoice", function () {

        let foodindex = $(this).data('foodindex');
        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $("#location").offset().top
        },
            'slow');
        console.log(foodindex);
        console.log(foodObject.restaurants[foodindex]);
        displayFoodChosen(foodObject.restaurants[foodindex]);

    });

    $('#meetups').on('click', '.meetupKey', function () {
        console.log($(this).data("key"));
        let key = $(this).data("key");
        $(".addBtn").show();
        console.log(meetupObject[key]);

        // console.log(meetupObject[key].group.lat);
        // console.log(meetupObject[key].group.lon);
        lat = meetupObject[key].group.lat;
        lon = meetupObject[key].group.lon;
        isMeetupChosen = true;
        searchZomato("Autsin", lat, lon);

        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $("#location").offset().top
        },
            'slow');


        displayMeetup(meetupObject[key]);
        //set up ajax function for pulling event data
        //change button color to show active
    })
    $('#movies').on('click', '.movieChosen', function () {
        console.log('movies clicked');
        let index = $(this).data("movieindex");
        $(".addBtn").show();
        displayMovieChosen(movieObject[index], omdbObject[index]);
        // console.log(omdbObject[index])
        clickedObject = {};
        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $("#location").offset().top
        },
            'slow');

        clickedObject = {
            Date: dateUsed,
            Type: "Movies",
            Name: movieObject[index].title
        };
        // console.log(clickedObject[index].Title)
        // console.log(omdbObject[index])
        //set up ajax fun
        //set up ajax function for pulling movie data
        //change button color to show active
    })

    // --- Daynamically created Buttons clicked - food, meetup, movies  ends

    // -- Calendar Date Picker begins ----
    // $('.dates').on('click', function () {
    //     console.log('dates clicked');
    //     //display calendar
    //     //save date
    // })

    $(function () {
        $('.datetimepicker').datetimepicker(
            {
                format: 'MM/DD',
            });
    });
    //realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            $("#options").removeClass("d-none")
            $("#itineraryContent").removeClass("d-none");
            $("#location").text("Austin, Texas");
            $(".loginRow").hide("slow   ");


            console.log("loggedin")
            $(".content").removeClass("d-none");


            $('#food').on('click', function () {
                console.log('food clicked');
                //set up ajax function for pulling restaurant data
                //change button color to show active
            })

            $('#meetups').on('click', '.meetupKey', function () {
                clickedObject = {};
                console.log($(this).data("key"));
                let key = $(this).data("key");
                console.log(meetupObject[key])
                $('.initialDisplay').removeClass("d-none");
                $('html,body').animate({
                    scrollTop: $("#location").offset().top
                },
                    'slow');
                let time = moment(meetupObject[key].local_time, 'HH:mm').format('hh:mm a')
                clickedObject = {
                    Date: dateUsed,
                    Type: "Meetup",
                    Name: meetupObject[key].name,
                    Location: meetupObject[key].venue.address_1,
                    Time: time,
                    link: meetupObject[key].link
                };

            })
            $('#movies').on('click', '.movieChosen', function () {
                console.log('movies clicked');
                
                $('.initialDisplay').removeClass("d-none");
                $('html,body').animate({
                    scrollTop: $("#location").offset().top
                },
                    'slow');

                //set up ajax fun
                //set up ajax function for pulling movie data
                //change button color to show active
            })

            // -- Calendar Date Picker begins ----
            // $('.dates').on('click', function () {
            //     console.log('dates clicked');
            //     //display calendar
            //     //save date
            // })

            $(".addBtn").on('click', function () {
                $('html,body').animate({
                    scrollTop: $("#calendar").offset().top
                },
                    'fast');
                console.log("clicked")
                $("#calendar").show('fade-in');
                let Date = moment(clickedObject.Date).format('YYYY-MM-DDTHH:mm')
                // database.ref().child(Date).on('value', function (snapshot) {
                //     snapshot.forEach(function (snapchild) {
                //         console.log(snapchild.val().Name);
                //         if (snapchild.val().Name == clickedObject.Name) return;
                //     })
                // })

                //ASK ANDREW

                if (clickedObject.Type == "Meetup") {
                    database.ref().child(Date).push({
                        Type: clickedObject.Type,
                        Name: clickedObject.Name,
                        Location: clickedObject.Location,
                        Time: clickedObject.Time,
                        link: clickedObject.link

                    })
                }
                if (clickedObject.Type == "Food") {
                    database.ref().child(Date).push({
                        Type: clickedObject.Type,
                        Name: clickedObject.Name
                    })
                }

                if (clickedObject.Type == "Movies") {
                    database.ref().child(Date).push({
                        Type: clickedObject.Type,
                        Name: clickedObject.Name
                    })
                }

                DatabaseToItinerary();
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('addEventSource', databaseObject);
            });

            $(function () {
                $('.datetimepicker').datetimepicker(
                    {
                        format: 'MM/DD',
                    });
            });

            $(".datetimepicker").on("dp.change", function (e) {
                // $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
                // console.log(e.date);
                // console.log(e.date._d);

                console.log(moment(e.date._d).format('YYYYMMDD'));
                datepick = e.date._d;
                //converting to utc for meetup api
                dateUsed = moment(datepick, 'MM/DD/YYYY').format('YYYY-MM-DDTHH:mm')
                meetupApi(dateUsed);
                console.log(dateUsed);
                movieDateUsed = moment(datepick, 'MM/DD/YYYY').format('YYYY-MM-DD')
                movieApi(movieDateUsed);
            });

            // console.log(moment(datepick).format('YYYYMMDD'));

            // --- Calendar Date Picker ends -------

            $('.itinerary').on('click', function () {
                console.log('itinerary clicked');
                //go to itinerary page
                //divide each into yes, maybe or saving for later
            })

            $('.search-button').on('click', function () {
                console.log('search clicked');
                let response = $('.search').val();
                console.log(response);
                $('.location').html(response);
                $('.search').val('');
                //get city data, populate results for food/events/movies

            })


            // using daynamicly created food buttons

            $("#food").on("click", ".foodchoice", function () {

                let foodindex = $(this).data('foodindex');
                $(".addBtn").show();
                $('.initialDisplay').removeClass("d-none");
                $('html,body').animate({
                    scrollTop: $("#location").offset().top
                },
                    'slow');
                clickedObject = {
                    Type: "Food",
                    Name: foodObject.restaurants[foodindex].restaurant.name,
                    Date: dateUsed
                };
                console.log(foodindex);
                console.log(foodObject.restaurants[foodindex]);

            });

            DatabaseToItinerary();
            console.log(databaseObject)
            // // makeEvent();
            // console.log("events", events)

            //Simulate an async call
            setTimeout(function () {
                $('#calendar').fullCalendar('addEventSource', databaseObject);
            }, 500);

            $("#calendar").fullCalendar({
                header: {
                    left: 'prev',
                    center: ' title ',
                    right: 'next'
                },
                height: 400,
                themeSystem: 'bootstrap3',
                themeButtonIcons: {
                    prev: 'circle-triangle-w',
                    next: 'circle-triangle-e',
                    prevYear: 'seek-prev',
                    nextYear: 'seek-next'
                }
            });

            //itinerary click event
            $("#itinerary").on("click", e => {
                $("#calendar").toggle('fade-in');
            })

        }

        else {
            $("#location").text("Please Login or Sign up");

            console.log("not logged in")

            //get elements
            const txtEmail = document.getElementById('txtEmail');
            const txtPassword = document.getElementById('txtPassword');
            const btnLogin = document.getElementById('btnLogin');
            const btnSignUp = document.getElementById('btnSignUp');

            //add login event
            $("#btnLogin").on("click", e => {
                const txtEmail = $("#txtEmail").val();
                const txtPassword = $("#txtPassword").val();
                const auth = firebase.auth();

                //sign in
                const promise = auth.signInWithEmailAndPassword(txtEmail, txtPassword);
                promise.catch(e => console.log(e.message))
            });



            //Add signup event
            $("#btnSignUp").on("click", e => {

                //TODO : CHECK FOR REAL EMAIL
                const txtEmail = $("#txtEmail").val();
                const txtPassword = $("#txtPassword").val();
                const auth = firebase.auth();

                //sign in
                const promise = auth.createUserWithEmailAndPassword(txtEmail, txtPassword);
                promise.catch(e => console.log(e.message))
            })
        }
    })

})
//GETS MEETUP API
function meetupApi(date) {
    let queryUrl = "https://api.meetup.com/find/upcoming_events?photo-host=public&order=time&start_date_range=" + date + "&page=10&text=austin&sign=true&key=883432577b254a175d755a767f1467";

    //runs ajax get
    $.ajax({

        dataType: 'jsonp',
        method: 'get',
        url: queryUrl,
        success: function (result) {

            meetupObject = [];
            console.log(result);
            meetupObject.push.apply(meetupObject, result.data.events);
            // console.log(data);

            // -- Not all events have all the data
            // -- detailed event:
            // console.log(result.data.events[0].name);
            // console.log(result.data.events[0].description);
            // console.log(result.data.events[0].venue.name);
            // console.log(result.data.events[0].venue.lat);
            // console.log(result.data.events[0].venue.lon);
            // console.log(result.data.events[0].local_date);
            // console.log(result.data.events[0].local_time);
            // console.log(result.data.events[0].fee.amount);
            // console.log(result.data.events[0].link);

            // -- non-detailed event:
            //  console.log(result.data.events[0].name);
            //  console.log(result.data.events[0].group.lat);
            //  console.log(result.data.events[0].group.lon);
            //  console.log(result.data.events[0].local_date);
            //  console.log(result.data.events[0].local_time);
            //  console.log(result.data.events[0].link);

            lat_meetup = result.data.events[0].group.lat;
            lon_meetup = result.data.events[0].group.lon;


            let group = "<div>";
            let key = 0;
            meetupObject.forEach(e => {
                let button = `<button data-key="${key}" class="meetupKey">`;
                let events = "";
                key++;

                //appents event name
                events += "<h6>" + e.group.name;
                events += "<h4>" + (e.name);

                //appends venue
                if (e.venue) events += "<h5>" + e.venue.name + "</h5><h6>" + e.venue.address_1
                events += "<a href = &qout" + e.link + "&qout></a>"

                //appends time
                let time = moment(e.local_time, 'HH:mm').format('hh:mm a')
                events += "<h6>" + time

                button += (events)
                group += (button)
            })
            $('#meetups').empty();
            $('#meetups').append(group);
        }
    })
}

// -- Zomato API - begins

function searchZomato(location, lat, lon) {

    // API data
    // -- search by city id (not by city name)
    // https://developers.zomato.com/api/v2.1/search?entity_id=278&entity_type=city&count=10&cuisines=55&sort=rating

    // -- search by lat long
    // https://developers.zomato.com/api/v2.1/search?count=10&lat=30.403009&lon=-97.724746&cuisines=55%2C1%2C3%2C73&sort=real_distance

    // location id: Austin=278, Round Rock=10903,  Pflugerville=10902, 
    //                cedar park=10897,    
    //                -- using lat long
    //                domain=30.403009,-97.724746 (first number is lat, second number is long)
    //                arboretum=30.393348,-97.743028
    //                downtown=30.271505,-97.754029
    //                UT campus=30.283684,-97.737435
    //                sunset valley=30.228064,-97.812052
    //                slaughter ln=30.167162,-97.785891
    //                -- using locality
    //                locality=tarrytown
    //                locality=hyde park
    //                locality=downtown
    //                locality=west campus
    //                locality=cheerywood
    //                locality=zilker
    // cuisine id: italian=55, Amercian=1, asian=3, bbq=193, burger=168, chinese=25, fast_food=40, 
    //             japanese=60, korean=67, mexican=73, pizza=82, sandwich=304, taco=997
    // establishment id: cafe=1
    // collection_id
    // category_id
    // sort by: rating, cost, real_distance
    // order 

    // -- search by city if nothing clicked
    //    search by lat long if meetup is clicked
    let url = "https://developers.zomato.com/api/v2.1/search";
    if (isMeetupChosen) {

        // -- search by lat long
        url += '?' + $.param({
            'entity_id': "278",
            'entity_type': "city",
            'lat': lat,
            'lon': lon,
            'cuisines': "55, 1, 3, 73",
            'count': food_limit,
            'sort': "real_distance"

        });

    }
    else {

        // -- search by city
        url += '?' + $.param({
            'entity_id': "278",
            'entity_type': "city",
            'lat': "",
            'lon': "",
            'cuisines': "55, 1, 3, 73",
            'count': food_limit,
            'sort': "rating"
        });
    }


    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", '8c68943a2837727c29f3dd83fe86245e');
        },
        method: 'GET',
        dataType: 'json',

    }).done(function (response) {
        // console.log(response);

        foodObject = response;
        // console.log(foodObject);

        displayZomato(response);
    }).fail(function (err) {
        throw err;
    });

    isMeetupChosen = false;
};

function displayZomato(data) {

    let foodCards = $("#food");

    foodCards.empty();

    for (let i = 0; i < food_limit; i++) {

        // data 
        let thumb_picture = data.restaurants[i].restaurant.thumb;
        let name = data.restaurants[i].restaurant.name;
        let address = data.restaurants[i].restaurant.location.address;
        let price_range = data.restaurants[i].restaurant.price_range;
        let cost = data.restaurants[i].restaurant.average_cost_for_two;
        let rating = data.restaurants[i].restaurant.user_rating.aggregate_rating;


        // console.log(data.restaurants[i].restaurant.thumb);
        // console.log(data.restaurants[i].restaurant.name);
        // console.log(data.restaurants[i].restaurant.location.address);
        // console.log(data.restaurants[i].restaurant.price_range);
        // console.log(data.restaurants[i].restaurant.average_cost_for_two);
        // console.log(data.restaurants[i].restaurant.user_rating.aggregate_rating);


        // clickable image element
        let imgButton = $("<button>");
        let imgElement = $("<img>");

        // // Adding a class
        imgButton.addClass("foodchoice");
        imgElement.addClass("thumb-food");

        // // Adding a data-attribute with a value of index i
        imgButton.attr("data-foodindex", i);

        // -- food picture
        // note: not all restaurants have pictures
        // imgElement.attr("src", thumb_picture);
        if (thumb_picture === "") {
            imgElement.attr("src", "assets/images/food_default.png");
        }
        else {
            imgElement.attr("src", thumb_picture);
        }

        imgButton.append(imgElement);

        imgButton.append("<p class=\"foodname\">" + name + "</p>");
        imgButton.append("<p class=\"foodaddress\">" + address + "</p>");
        imgButton.append("<p class=\"foodcost\">" + "Cost for Two : $" + cost + "</p>");
        foodCards.append(imgButton);
    }

};
// -- Zomato API ends ----

// function used for when user click the food, it will display more info
function displayFoodChosen(data) {

    let foodCard = $(".initialDisplay");

    foodCard.empty();

    // data 
    let thumb_picture = data.restaurant.thumb;
    let name = data.restaurant.name;
    let address = data.restaurant.location.address;
    let price_range = data.restaurant.price_range;
    let cost = data.restaurant.average_cost_for_two;
    let rating = data.restaurant.user_rating.aggregate_rating;
    let phone = data.restaurant.phone_numbers; // not work
    let menu_url = data.restaurant.menu_url;
    let type = data.restaurant.cuisines;


    // console.log(data.restaurant.thumb);
    // console.log(data.restaurant.name);
    // console.log(data.restaurant.location.address);
    // console.log(data.restaurant.price_range);
    // console.log(data.restaurant.average_cost_for_two);
    // console.log(data.restaurant.user_rating.aggregate_rating);
    // console.log(data.restaurant.phone_numbers);
    // console.log(data.restaurant.menu_url);
    // console.log(data.restaurant.cuisines);


    // image element
    let imgDiv = $("<div>");
    let imgElement = $("<img>");

    // // Adding a class
    imgDiv.addClass("col-lg-4");
    imgElement.addClass("thumb-food-chosen");

    // -- food picture
    // note: not all restaurants have pictures
    imgElement.attr("src", thumb_picture);
    if (thumb_picture === "") {
        imgElement.attr("src", "assets/images/food_default.png");
    }
    else {
        imgElement.attr("src", thumb_picture);
    }

    imgDiv.append(imgElement);
    foodCard.append(imgDiv);

    // -- description element
    let desDiv = $("<div>");
    desDiv.addClass("col-lg-6");

    desDiv.append("<p class=\"foodname-chosen\">" + name + "</p>");
    desDiv.append("<p class=\"foodaddress-chosen\">" + address + "</p>");
    desDiv.append("<p class=\"foodtype-chosen\">" + "Cuisine : " + type + "</p>");
    desDiv.append("<p class=\"foodrating-chosen\">" + "Rating : " + rating + "</p>");
    desDiv.append("<p class=\"foodcost-chosen\">" + "Cost for Two : $" + cost + "</p>");
    // desDiv.append("<p class=\"foodmenu-chosen\"><button type=\"button\" class=\"btn-dark\">" + "<a href =\"" + menu_url + "\">Menu</a></button></p>");
    foodCard.append(desDiv);

    // -- button for Add to Cart


};

//GET Movies API data
function movieApi(date) {
    $('#movies').empty();
    omdbObject = [];
    let movieQueryUrl = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDateUsed + "&zip=78704&api_key=acy2x82ygb3ce5v3v36f8b7p";
    //if error on movieQueryURL persists, try this key:p54wc8q9rw4m9bezu48fs7cg
    // console.log('movieQueryUrl: ', movieQueryUrl)


    let movieData = [];
    let movieLimit = movieData.slice(0, 24);
    // console.log('movieLimit', movieLimit);

    $.ajax({
        //dataType: 'jsonp',
        url: movieQueryUrl,
        method: "GET"
    }).then(function (data) {
        // console.log('Initial data: ', data);
        let moviesLimit = data.slice(0, 25);
        let movieArray = [];
        movieArray.push(moviesLimit);
        // console.log('movieArray: ', movieArray);
        // console.log('25 movies: ', moviesLimit);
        movieObject = data;
        let movieTimeFormat = moment("2018-09-26T11:00", 'YYYY-MM-DDTHH:mm').format('LT');
        // console.log('MOVIE TIME FORMAT: ', movieTimeFormat)

        for (let n = 0; n < moviesLimit.length; n++) {
            let movieTitles = moviesLimit[n].title;
            let description = moviesLimit[n].shortDescription;
            // console.log('description: ', description);
            // console.log('movieTitles: ', movieTitles);

            let movieButtons = $('<button>');
            movieButtons.addClass('movie-btn movieChosen');
            movieButtons.attr('data-movies', movieTitles);
            movieButtons.attr('data-movieindex', n);
            let movieTimes = moviesLimit[n].showtimes;
            let movieHour;
            let newMovieTime;

            let theatreNames;
            for (let m = 0; m < movieTimes.length; m++) {
                // console.log('m: ', m);
                theatreNames = movieTimes[m].theatre.name;
                movieHour = movieTimes[m].dateTime;
                // console.log('theaterNames: ', theatreNames);
                newMovieTime = moment(movieHour).format('LT');
                // console.log('newMovieTime', newMovieTime);
            }
            // console.log('movieTimes: ', movieTimes);

            let omdbURL = "https://www.omdbapi.com/?t=" + movieTitles + "&plot=short&apikey=trilogy";

            $.get(omdbURL).then(data => {
                plot = data.Plot;
                poster = data.Poster;
                omdbObject[n] = JSON.stringify(data);
                console.log(data)
                // console.log("POSTER: ", poster);
                // console.log('PLOT: ', plot)
                // console.log('data response: ', data.Response)
                if (data.Response === "False") {
                    //movieButtons.html omits 'plot' and 'poster' from the DOM
                    movieButtons.html('<h4><em>' + movieTitles + '</em></h4><h5>' + theatreNames + '</h5><h6>' + newMovieTime + '</h6>');
                }
                else {
                    //movieButtons.html displays data from OMDB
                    movieButtons.html('<h4><em>' + movieTitles + '</em></h4><h5>' + plot + '</h5><img src="' + poster + '">' + theatreNames + '</h5><h6>' + newMovieTime + '</h6>');
                }
            })

            $('#movies').append(movieButtons);

        }


    })
}

// -- geo distance function
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2017            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

function itinerary() {

}

function DatabaseToItinerary() {
    databaseObject = [];
    let datesRef = database.ref();

    datesRef.on('child_added', function (childsnap) {
        // console.log(childsnap.ref.key);
        // console.log(childsnap.val());
        childsnap.forEach(function (grandchildsnap) {
            // console.log(grandchildsnap.val())
            // console.log(childsnap.ref.key)
            let objectContainer = {};
            objectContainer =
                {
                    title: grandchildsnap.val().Name,
                    start: childsnap.ref.key,
                    allDay: true
                }

            databaseObject.push(objectContainer)
        })

    })

    console.log(databaseObject)
}

function displayMeetup(data) {

    let meetupCards = $(".initialDisplay");
    meetupCards.empty();

    //pulling data
    console.log(data)

    // image element
    let imgDiv = $("<div>");
    let imgMeetup = $("<img>");

    // // Adding a class
    imgDiv.addClass("col-lg-3");
    imgMeetup.addClass("meetupImg");
    imgDiv.addClass("my-auto")

    imgMeetup.attr("src", "assets/images/meetup.jpg");
    imgDiv.append(imgMeetup);
    meetupCards.append(imgDiv);

    // -- description element
    let desDiv = $("<div>");
    desDiv.addClass("col-lg-7");

    desDiv.append("<h2 class=\"meetup-name text-center\">" + data.name + "</h1>");
    if (data.venue) desDiv.append("<h6 class=\"foodaddress-chosen\">" + data.venue.name + "</h6>");

    desDiv.append("<span class=\" text-left \">" + "Description : " + data.description + "</span>");
    // desDiv.append("<p class=\"foodmenu-chosen\"><button type=\"button\" class=\"btn-dark\">" + "<a href =\"" + menu_url + "\">Menu</a></button></p>");
    meetupCards.append(desDiv);

    // -- button for Add to Cart


};


// function used for when user click the meetup, it will display more info
function displayMovieChosen(movie, omdbS) {

    console.log(omdbS)
    let movieCard = $(".initialDisplay");
    let omdb = JSON.parse(omdbS);
    movieCard.empty();
    // console.log(movieCard)
    // -- data from movies api
    // console.log(movie.title);
    // console.log(movie.showtimes);
    // console.log(movie.showtimes[0].dateTime);
    // console.log(movie.showtimes[0].theatre.name);
    // console.log(movie.showtimes[0].theatre.id);
    // console.log(movie.entityType);
    // console.log(movie.genres[0]);
    // console.log(movie.shortDescription);
    // console.log(movie.releaseDate);
    // console.log(movie.advisories);
    // console.log(movie.directors);
    // console.log(movie.topCast);
    // console.log(movie.longDescription);

    // -- data from omdb
    // console.log(omdb.Title);
    // console.log(omdb.Runtime);
    // console.log(omdb.Released);
    // console.log(omdb.Rated);
    // console.log(omdb.Plot);
    // console.log(omdb.Poster);

    // console.log(movie);
    // console.log(omdb);

    let title = movie.title;
    let time = moment(movie.showtimes[0].dateTime).format('LT');
    let theatre = (movie.showtimes[0].theatre.name);
    let genre = movie.genres[0];
    let short = movie.shortDescription;
    let long = movie.longDescription;
    // let release = moment(movie.releaseDate).format('YYYY');
    let advisory = movie.advisories;
    let director = movie.directors;
    let cast = movie.topCast;

    let runtime = omdb.Runtime;
    let release = moment(omdb.Released).format('YYYY');
    let rated = omdb.Rated;
    let plot = omdb.Plot;
    let poster = omdb.Poster;

    // image element
    let imgDiv = $("<div>");
    let imgElement = $("<img>");

    // // Adding a class
    imgDiv.addClass("col-lg-4");
    imgElement.addClass("thumb-movie-chosen");

    // -- movie picture 
    imgElement.attr("src", poster);

    imgDiv.append(imgElement);
    movieCard.append(imgDiv);

    // -- description element
    let desDiv = $("<div>");
    desDiv.addClass("col-lg-6");


    desDiv.append("<h4 class=\"movie-chosen\">" + title + "</h4>");
    desDiv.append("<h5 class=\"movietheatre-chosen\">" + theatre + "</h5>");
    desDiv.append("<h5 class=\"movietime-chosen\">Show Time : " + time + "</h5>");
    desDiv.append("<p class=\"moviedes-chosen\">Genre : " + genre + "</p>");
    desDiv.append("<p class=\"moviedes-chosen\">Rated : " + rated + "</p>");
    desDiv.append("<p class=\"moviedes-chosen\">Advisory : " + advisory + "</p>");
    desDiv.append("<p class=\"movierelease-chosen\">Release : " + release + "</p>");
    desDiv.append("<p class=\"movierelease-chosen\">Run Time : " + runtime + "</p>");
    desDiv.append("<p class=\"moviedirector-chosen\">Director : " + director + "</p>");
    desDiv.append("<p class=\"moviecast-chosen\">Casts : " + cast + "</p>");
    desDiv.append("<p class=\"movieplot-chosen\">Plot : " + long + "</p>");
    movieCard.append(desDiv);

    // -- button for Add to Cart
    // let cartBtn = $("<button>");
    // cartBtn.addClass("w-100 float-right col-lg-2 btn btn-light btn-lg addBtn h-25 mt-5");
    // // cartBtn.text("Add Event");
    // movieCard.append(cartBtn);

}