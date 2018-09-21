$(document).ready(function() {
    $('#food').on('click', function () {
        console.log('food clicked');
        //set up ajax function for pulling restaurant data
        //change button color to show active
    })
    $('#events').on('click', function () {
        console.log('events clicked');
        //set up ajax function for pulling event data
        //change button color to show active
    })
    $('#movies').on('click', function () {
        console.log('movies clicked');
        //set up ajax function for pulling movie data
        //change button color to show active
    })
    $('#user-dates').on('click', function () {
        console.log('dates clicked');
        //display calendar
        //save date
    })
    $('#itin').on('click', function () {
        console.log('itinerary clicked');
        //go to itinerary page
        //divide each into yes, maybe or saving for later
    })
    $('.search-button').on('click', function () {
        console.log('search clicked');
        let response = $('.search').val();
        console.log(response);
        $('#location').html(response);
        $('.search').val('');
        //get city data, populate results for food/events/movies
    })
    $('#dropdownMenuButton').on('click', function () {
        console.log('dropdown clicked');
        //clicked, but no dropdown
    })
    $('#register').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this)
        modal.find('.modal-title').text('New message to ' + recipient)
        modal.find('.modal-body input').val(recipient)
      })
var config = {
    apiKey: "AIzaSyCXn1sbvI8TkwpdQuURWkamAsfmNpencYA",
    authDomain: "project1auth.firebaseapp.com",
    databaseURL: "https://project1auth.firebaseio.com",
    projectId: "project1auth",
    storageBucket: "project1auth.appspot.com",
    messagingSenderId: "658376280287"
};
firebase.initializeApp(config);

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
})
