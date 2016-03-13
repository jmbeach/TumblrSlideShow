//#region CONSTANTS
var strIdSidebar = "#sidebar";
var strIdBtnUnsub = "#btnUnSub";
var strIdBtnSub = "#btnSub";
var strIdBtnLike = "#btnLike";
var strIdBtnReblog = "#btnReblog";
var strIdBtnNext = "#btnNext";
var strIdBtnPrev = "#btnPrev";
var strIdSlideShow = "#maximage";
var strIdBtnPlayPause = "#btnPlayPause";
var strIdSlider = "#slider";
var strIdNotifications = "#notifications";
//#endregion
//#region JQUERY_UI
var $sidebar = null;
var $btnUnsub = null;
var $btnSub = null;
var $btnLike = null;
var $btnReblog = null;
var $btnNext = null;
var $slideShow = null;
var $btnPrev = null;
var $btnPlayPause = null;
var $slider = null;
var slider = null;
var $notifications = null;
//#endregion
//#region PRIVATE_FIELDS
//#endregion
//#region METHODS
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
//#endregion
//#region EVENTS
$(document).ready(function () {
    slider = new $("#sidebar").sidebar({ close: false });
    $("#btnMenu").click(function () {
        console.log("clicked sidebar button");
        $("#sidebar").trigger("sidebar:toggle");
        var left = $("#btnMenu").css("left");
        var sidebarWidth = $("#sidebar").width();
    });
    $("#cbShowCaption").click(function () {
        var cb = $(this);
        if (cb.is(":checked")) {
            $(".slide-caption").show();
        }
        else {
            $(".slide-caption").hide();
        }
    });
    $slider = $(strIdSidebar);
    $btnUnsub = $(strIdBtnUnsub);
    $btnSub = $(strIdBtnSub);
    $btnLike = $(strIdBtnLike);
    $btnPrev = $(strIdBtnPrev);
    $btnReblog = $(strIdBtnReblog);
    $btnNext = $(strIdBtnNext);
    $slideShow = $(strIdSlideShow);
    $btnPlayPause = $(strIdBtnPlayPause);
    $slider = $(strIdSlider);
    $notifications = $(strIdNotifications);
});

// on load make image scaling slider
$(strIdSlider).slider({
    min: 1,
    max: 5,
    change: function (event, ui) {
        var newValue = $slider.slider("value");
        dataRetriever.imgScale = newValue;
        //console.log("new img scale: ", imgScale);
        scaleImage();
    }
});

//#region USER_INTERACTION_EVENTS
$(strIdBtnPrev).click(function () {
    $btnPrev.rsfSlideshow('previousSlide');
});
$(strIdBtnPlayPause).click(function () {
    togglePlay();
})
$(document).keypress(function (e) {
    //console.log(e);
    // ;
    if (e.which == 59) {
        reblogPost();
    }
    // h
    if (e.which == 104) {
        subscribeToBlogger();
    }
    // j
    else if (e.which == 106) {
        $slideShow.rsfSlideshow('nextSlide');
        scaleImage();
    }
    //k
    else if (e.which == 107) {
        $slideShow.rsfSlideshow('previousSlide');
    }
    // l
    else if (e.which == 108) {
        likePost(function () { });
    }
    // m
    else if (e.which == 109) {
        $slider.trigger("sidebar:toggle");
    }
    // p
    else if (e.which == 112) {
        dataRetriever.togglePlay();
    }
    //u
    else if (e.which == 117) {
        unsubUser();
    }
});
$(window).resize(function () {
    scaleImage();
});
$(strIdBtnNext).click(function () {
    $slideShow.rsfSlideshow('nextSlide');
});
function reblogPost() {
    var notifyObject = !slider.isClosed() ? $btnReblog : $notifications;
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
$(strIdBtnReblog).click(function () {
    reblogPost();
});
function likePost() {
    var notifyObject = !slider.isClosed() ? $btnLike : $notifications;
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
$(strIdBtnLike).click(function () {
    likePost();
});

function subscribeToBlogger() {
    var notifyObject = !slider.isClosed() ? $btnSub : $notifications;
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
$(strIdBtnSub).click(function () {
    subscribeToBlogger();
});
$(strIdBtnUnsub).hover(function () {
    var blogName = dataRetriever.photoBlogArray[dataRetriever.slideNumber];
    //console.log("blog to unsub: ", blogName);
    if (blogName != undefined) {
        $btnUnsub.notify("Unsubscribe user: " + blogName + ".", {
            position: "right",
            className: "info",
            showDuration: 50
        });
    } else {
        $btnUnsub.notify("No source found.", {
            position: "right",
            className: "info",
            showDuration: 50
        });
    }
});

$(strIdBtnSub).hover(function () {
    // console.log("tData posts",tData);
    var blogName = dataRetriever.photoSourceArray[dataRetriever.slideNumber];
    console.log("blog to sub: ", blogName);
    if (typeof (blogName) != "undefined") {
        $btnSub.notify("Subscribe user: " + blogName + ".", {
            position: "right",
            className: "info",
            showDuration: 50
        });
    } else {
        $btnSub.notify("No source found.", {
            position: "right",
            className: "info",
            showDuration: 50
        });
    }
});
function unsubUser() {
    var notifyObject = !slider.isClosed() ? $btnUnsub : $notifications;
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
$(strIdBtnUnsub).click(function () {
    unsubUser();
});



//#endregion
//#endregion
