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


$(document).ready(function () {
    $('.food').on('click', function () {
        console.log('food clicked');
        //set up ajax function for pulling restaurant data
        //change button color to show active
    })
    $('.events').on('click', function () {
        console.log('events clicked');
        //set up ajax function for pulling event data
        //change button color to show active
    })
    $('.movies').on('click', function () {
        console.log('movies clicked');
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
})


//google auth
$(document).ready(function () {


    meetupApi();
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
function meetupApi() {
    let queryUrl = "https://api.meetup.com/find/upcoming_events?photo-host=public&page=10&text=austin&sign=true&key=883432577b254a175d755a767f1467"
    if (!data) data = [];

    //runs ajax get
    $.ajax({

        dataType: 'jsonp',
        method: 'get',
        url: queryUrl,
        success: function (result) {
            console.log(result);
            data.push.apply(data, result.data.events);
            console.log(data);

            let group = "<div> ";
            data.forEach(e => {
                let button = "<button>"
                let events = "";
                //appents event name
                events += "<h5>" + e.group.who;
                events += "<h4>" + (e.name);

                //appends venue
                if (e.venue) events += "<h5>" + e.venue.name + "</h5><h6>" + e.venue.address_1
                events += "<a href = &qout" + e.link + "&qout></a>"
                button += (events)
                group += (button)
            })
            $('.events').append(group)
        }
    })
}

