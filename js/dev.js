var isDebugEnabled = true;


function openBookDetails(caller){
    console.warn("you clicked me!");
    console.warn(caller);

    if ($(caller).hasClass("book-details-container")) {
        $(caller).addClass("col s12 m6 l4");
        $(caller).removeClass("book-details-container");
    }
    else{
        $(caller).removeClass("col s12 m6 l4");
        $(caller).addClass("book-details-container");
    }
}