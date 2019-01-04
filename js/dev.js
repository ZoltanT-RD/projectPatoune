/*** DEV section ***/
var isDebugEnabled = true;

var zout = {
    i: function (msg) {
        if (isDebugEnabled) {
            console.log(msg);
        }
    },
    w: function (msg) {
        if (isDebugEnabled) {
            console.warn(msg);
        }
    },
    e: function (msg) {
        if (isDebugEnabled) {
            console.error(msg);
        }
    }
}



/*** production code section ***/


var openedBookDetailsContainer = null;



function openBookDetails(caller){

    zout.i("opening detail view");

    $(this).attr('id', 'book-details-container'); //give temorary ID to the opened card

    openedBookDetailsContainer = caller;

    //enabling details view
    $(caller).removeClass("col s12 m6 l4 link-cursor");
    $(caller).addClass("book-details-container");
    $(caller).off(); //disable click listener

    $("#backdrop").css("visibility","visible");

    if (window.scrollY > 0) {
        zout.i("scrolling to top of the page");
        $('html,body').animate({
            scrollTop: 0
        }, 500);
    }
};

function closeBookDetails(){

    zout.i("closing detail view");

    //disabling detail view
    $(openedBookDetailsContainer).addClass("col s12 m6 l4 link-cursor");
    $(openedBookDetailsContainer).removeClass("book-details-container");
    $(openedBookDetailsContainer).on("click", function() {
        openBookDetails(this);
    });

    $(openedBookDetailsContainer).removeAttr("id");
    openedBookDetailsContainer = null;

    $("#backdrop").css("visibility","hidden");

    window.scroll(0, 0);

};


var listeners = {

    init: function() {

        zout.i("attaching listeners...");

        $(".book-card").on("click", function() {
            openBookDetails(this);
        });

        $("#backdrop").on("click", function() {
            closeBookDetails();
        });
    }
}

$( document ).ready(function() {

    zout.i("document ready!");

    listeners.init();

    $('.sidenav').sidenav();
});