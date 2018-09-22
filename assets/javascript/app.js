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


$(document).ready(function () {
    meetupApi(dateUsed);

    $('#food').on('click', function () {
        console.log('food clicked');
        //set up ajax function for pulling restaurant data
        //change button color to show active
    })
    $('#meetups').on('click', function () {
        console.log('events clicked');
        //set up ajax function for pulling event data
        //change button color to show active
    })
    $('#movies').on('click', function () {
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
        //converting to utc for meetup api
        dateUsed = moment(datepick, 'MM/DD/YYYY').format('YYYY-MM-DDTHH:mm')
        meetupApi(dateUsed);
        console.log(dateUsed)
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
    let queryUrl = "https://api.meetup.com/find/upcoming_events?photo-host=public&order=time&start_date_range=" + date + "&page=10&text=austin&sign=true&key=883432577b254a175d755a767f1467"
    let data = [];

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

