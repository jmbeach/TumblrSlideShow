var strIdSlideShow = "#maximage";
var strIdNotifications = "#notifications";
var $slideShow = null;
var $notifications = null;

// on load
$(function() {
  $slideShow = $(strIdSlideShow);
  $notifications = $(strIdNotifications);
});

function togglePlay() {
    $slideShow.rsfSlideshow('toggleShow');
    $btnPlayPause.notify("Slideshow toggled.", {
        position: "right",
        className: "success",
        showDuration: 200
    });
}

function scaleImage() {
    var $img = $(".rs-slideshow .slide-container img");
    dataRetriever.scaleImage($img, $img.width(), $img.height());
}

$('body').keydown(function(e) {
    console.log(e);
    // ;
    if (e.which == 186) {
        reblogPost();
    }
    // h
    if (e.which == 72) {
        subscribeToBlogger();
    }
    // j
    else if (e.which == 74) {
		console.log("j pressed: next slide");
        $slideShow.rsfSlideshow('nextSlide');
        scaleImage();
    }
    //k
    else if (e.which == 75) {
        $slideShow.rsfSlideshow('previousSlide');
    }
    // l
    else if (e.which == 76) {
        likePost(function () { });
    }
    // m
    else if (e.which == 77) {
        $slider.trigger("sidebar:toggle");
    }
    // p
    else if (e.which == 80) {
        dataRetriever.togglePlay();
    }
    //u
    else if (e.which == 85) {
        unsubUser();
    }
});
$(window).resize(function () {
    scaleImage();
});
function reblogPost() {
    var notifyObject = $notifications;
    dataRetriever.reblogPost(function (err) {
        if (err == undefined) {

            notifyObject.notify("Rebloged post!", {
                position: "right",
                className: "success",
                showDuration: 200
            });
        }
        else {
            notifyObject.notify(err, {
                position: "right",
                className: "error",
                showDuration: 200
            });
        }
    });
}
function likePost() {
    var notifyObject = $notifications;
    dataRetriever.likePost(function (err) {
        if (err != undefined && err != "") {
            notifyObject.notify(err, {
                position: "right",
                className: "error",
                showDuration: 200
            });
        }
        else {
            notifyObject.notify("Liked post!", {
                position: "right",
                className: "success",
                showDuration: 200
            });
        }
    });
}

function subscribeToBlogger() {
    var notifyObject = $notifications;
    var blogName = dataRetriever.photoSourceArray[dataRetriever.slideNumber];
    //if (blogName == null) {
    //callback("No original source found.");
    //}
    //else {
    dataRetriever.subscribeBlog(function (err) {
        if (err != undefined && err != "") {
            notifyObject.notify(err, {
                position: "right",
                className: "warning",
                showDuration: 200
            });
        }
        else {
            notifyObject.notify("Successfully subscribed to " + blogName + ".", {
                position: "right",
                className: "success",
                showDuration: 200
            });
        }
    });
    //}
}


function unsubUser() {
    var notifyObject = $notifications;
    var blogName = dataRetriever.photoBlogArray[dataRetriever.slideNumber];
    dataRetriever.unsubUser(function (err) {
        if (err != undefined && err != "") {
          console.log(err);
            notifyObject.notify("An error occurred while unsubscribing user: " + err, {
                position: "right",
                className: "error",
                showDuration: 200
            });
        }
        else {
            notifyObject.notify("Successfully unsubscribed from " + blogName + ".", {
                position: "right",
                className: "success",
                showDuration: 200
            });
        }
    });
}
