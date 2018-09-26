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
let data;
let datepick = "";
let dateUsed = moment().format('YYYY-MM-DDTHH:mm');
console.log(dateUsed)

let food_limit = 10;
let foodObject = {};

let meetupObject = [];

$(document).ready(function () {
    meetupApi(dateUsed);
    movieDateUsed = moment(dateUsed).format('YYYY-MM-DD');
    movieApi(movieDateUsed);


    $('#food').on('click', function () {
        console.log('food clicked');
        //set up ajax function for pulling restaurant data
        //change button color to show active
    })
    $('#meetups').on('click', '.meetupKey', function () {
        console.log($(this).data("key"));
        let key =  $(this).data("key");
        console.log(meetupObject[key])
        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $(".headDisplay").offset().top},
            'slow');
        //set up ajax function for pulling event data
        //change button color to show active
    })
    $('#movies').on('click', function () {
        console.log('movies clicked');
        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $(".headDisplay").offset().top},
            'slow');
        //set up ajax fun
        //set up ajax function for pulling movie data
        //change button color to show active
    })

    // -- Calendar Date Picker -- begins

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

    $(".datetimepicker").on("dp.change", function (e) {
        // $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
        console.log(e.date);
        console.log(e.date._d);

        console.log(moment(e.date._d).format('YYYYMMDD'));
        datepick = e.date._d;
        //converting to utc for meetup api
        dateUsed = moment(datepick, 'MM/DD/YYYY').format('YYYY-MM-DDTHH:mm')
        meetupApi(dateUsed);
        console.log(dateUsed);
        movieDateUsed = moment(datepick, 'MM/DD/YYYY').format('YYYY-MM-DD')
        movieApi(movieDateUsed);
    });

    console.log(moment(datepick).format('YYYYMMDD'));

    // --- Calendar Date Picker -- ends

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
        $('.initialDisplay').removeClass("d-none");
        $('html,body').animate({
            scrollTop: $(".headDisplay").offset().top},
            'slow');
        console.log(foodindex);
        console.log(foodObject.restaurants[foodindex]);

    });
})


//google auth
$(document).ready(function () {
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

    //realtime listener
    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser)
        } else {
            console.log("not logged in")
        }
    })
});

//GETS MEETUP API
function meetupApi(date) {
    let queryUrl = "https://api.meetup.com/find/upcoming_events?photo-host=public&order=time&start_date_range=" + date + "&page=10&text=austin&sign=true&key=883432577b254a175d755a767f1467";

    //runs ajax get
    $.ajax({

        dataType: 'jsonp',
        method: 'get',
        url: queryUrl,
        success: function (result) {
            console.log(result);
            meetupObject.push.apply(meetupObject, result.data.events);
            console.log(data);

            let group = "<div>";
            let key=0;
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
            $('#meetups').append(group)
        }
    })
}

// -- Zomato API - begins

function searchZomato(location) {

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



    let url = "https://developers.zomato.com/api/v2.1/search";
    url += '?' + $.param({
        'entity_id': "278",
        'entity_type': "city",
        'lat': "",
        'lon': "",
        'cuisines': "55, 1, 3, 73",
        'count': food_limit,
        'sort': "rating"

    });

    $.ajax({
        url: url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("user-key", '8c68943a2837727c29f3dd83fe86245e');
        },
        method: 'GET',
        dataType: 'json',

    }).done(function (response) {
        console.log(response);

        foodObject = response;
        console.log(foodObject);

        displayZomato(response);
    }).fail(function (err) {
        throw err;
    });


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
        imgElement.attr("src", thumb_picture);
        imgButton.append(imgElement);

        imgButton.append("<p class=\"foodname\">" + name + "</p>");
        imgButton.append("<p class=\"foodaddress\">" + address + "</p>");
        imgButton.append("<p class=\"foodcost\">" + "Cost for Two : $" + cost + "</p>");
        foodCards.append(imgButton);
    }

};
// -- Zomato API -- ends

// -- main program
searchZomato("Austin");

//GET Movies API data
function movieApi(date) {
    $('#movies').empty();
    let movieQueryUrl = "http://data.tmsapi.com/v1.1/movies/showings?startDate=" + movieDateUsed + "&zip=78704&api_key=szt5azey9rbbjqc8jypd7cvw";
    //if error on movieQueryURL persists, try this key:p54wc8q9rw4m9bezu48fs7cg
    console.log('movieQueryUrl: ', movieQueryUrl)
    let movieData = [];
    let movieLimit = movieData.slice(0, 24);
    console.log('movieLimit', movieLimit);

    $.ajax({
        //dataType: 'jsonp',
        url: movieQueryUrl,
        method: "GET"
    }).then(function (data) {
        console.log('Initial data: ', data);
        let moviesLimit = data.slice(0, 25);
        let movieArray = [];
        movieArray.push(moviesLimit);
        console.log('movieArray: ', movieArray);
        console.log('25 movies: ', moviesLimit);

        let movieTimeFormat = moment("2018-09-26T11:00", 'YYYY-MM-DDTHH:mm').format('LT');
        console.log('MOVIE TIME FORMAT: ',movieTimeFormat)

        for (let n = 0; n < moviesLimit.length; n++) {
            let movieTitles = moviesLimit[n].title;
            let description = moviesLimit[n].shortDescription;
            console.log('description: ',description);
            console.log('movieTitles: ', movieTitles);

            let movieButtons = $('<button>');
            movieButtons.addClass('movie-btn');
            movieButtons.attr('data-movies', movieTitles);
            let movieTimes = moviesLimit[n].showtimes;
            let movieHour;
            let newMovieTime;
            
            let theatreNames;
            for (let m = 0; m < movieTimes.length; m++) {
                console.log('m: ', m);
                theatreNames = movieTimes[m].theatre.name;
                movieHour = movieTimes[m].dateTime;
                console.log('theaterNames: ', theatreNames);
                 newMovieTime = moment(movieHour).format('LT');
                console.log('newMovieTime',newMovieTime);
            }
            console.log('movieTimes: ', movieTimes);

            movieButtons.html('<h4><em>' + movieTitles + '</em></h4><h5>' +theatreNames +'</h5><h6>'+newMovieTime+'</h6>');

            $('#movies').append(movieButtons);

        }


    })
}