$(document).ready(function() {
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
    $('.dates').on('click', function () {
        console.log('dates clicked');
        //display calendar
        //save date
    })
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