
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeader = $("#wikipedia-header");
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    // Variables declaration
    var nameStreet = $("#street").val();
    var nameCity = $("#city").val();
    var googleURL = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=";
    var nytURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?"
    // We're getting the article URL, the headline, the snippet from the newest to the oldest
    const nytAPI = "&api-key=56f5217bab2c4ae59ff1295c27c551fe&sort=newest&fl=web_url,snippet,headline&q=";

    // Proper coding
    

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Make sure the initial letter of the city is always capital
    nameCity = capitalizeFirstLetter(nameCity);

    $greeting.text("So, you're looking for "+nameStreet+ " street in "+nameCity+"?");

    googleURL += nameStreet + ", " + nameCity;
    nytURL += nytAPI + nameCity;

    // Append the Google Street View and the NYT Snippets to the DOM

    $body.append("<img src=" + googleURL + " class='bgimg'>");
    $nytHeaderElem.text("New York Times articles about " + nameCity);

    $.getJSON(nytURL, function(data){   // Get JSON from NYTimes
        
        var myJson = data.response.docs;
        // Append urls, headlines and snippets        
        $.each(myJson, function(key, val){
            $nytElem.append("<li class='article' id=" + key + ">" + 
            "<a href=" + val.web_url + "target='_blank'>" + val.headline.main + "</a>" + "<p>" +
             val.snippet + "</p></li>");
        });
    })

    // Handle a failed AJAX request

        .fail(function() {
            $nytHeaderElem.text("Cannot find articles about " + nameCity);
        });

    // Get information from Wikipedia
    const wikiep = "https://en.wikipedia.org/w/api.php";    // Wiki endpoint
    var wikiURL = wikiep + "?action=opensearch&limit=10&search=" + nameCity;

    // Gives AJAX 8s to get on with the request. Otherwise, failure.
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("Failed to get Wikipedia resources.");
    }, 8000);

    $.ajax({
        url: wikiURL,
        dataType: "jsonp",
        type: "GET",
        success: function(data) {          
            var myJson = data;
            for (var i = 0; i < myJson[1].length; i++){
                $wikiElem.append("<li><a href=" + myJson[3][i] + ">" + myJson[1][i] + "</a></li>");
            }
            clearTimeout(wikiRequestTimeout);   // Cancel the timeout
        }  
    });
    return false;
};

$('#form-container').submit(loadData);
