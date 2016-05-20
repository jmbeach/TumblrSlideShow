function tumblrDataRetriever() {

    //#region PRIVATE_FIELDS
    var pLimit = 5;
    var postOffset = 0;
    var slideNumberOfCurrentPost = 0;
    var postNumber = 0;
    var postSetNumber = 0;
    var strQueryBpm = "bpm";
    var imgArray = [];
    //#endregion

    //#region FIELDS
    this.slideNumber = 0;
    this.totalPhotoCount = 0;
    this.imgScale = 1;
    var post;
    var postIndex = 0;
    // get photo source with slideNumber as index.
    this.photoSourceArray = [];
    this.photoBlogArray = [];
    this.photoIdArray = [];
    this.photoReblogKeyArray = [];
    this.photoTextArray = [];
    this.previousSlideColor = "white";
    //#endregion
    //#region PRIVATE_METHODS
    this.addImages = function (data) {
        // console.log(data);
        for (var i = 0; i < data.posts.length; i++) {
            var count = 0;
            for (var j = 0; j < data.posts[i].photos.length; j++) {
                var photo = data.posts[i].photos[j];
                var url = photo.original_size.url;
								var cache_image = $('<img src="'+url+'" style="display:none"/>');
								$("body").append(cache_image);
                var source = data.posts[i].source_title;
                var blogName = data.posts[i].blog_name;
                var id = data.posts[i].id;
                var text = data.posts[i].caption;
                var reblogKey = data.posts[i].reblog_key;
                // console.log(url);
                addImage(url, text);
                dataRetriever.photoSourceArray.push(source);
                dataRetriever.photoBlogArray.push(blogName);
                dataRetriever.photoIdArray.push(id);
                dataRetriever.photoTextArray.push(text);
                dataRetriever.photoReblogKeyArray.push(reblogKey);
                count++;
            }
        }
        console.log(imgArray, "image array");
    }
    var addImage = function (imgUrl, text) {
        // console.log(url);
        //var maxImageDiv = $('#maximage')[0];
        // var img = $("<img src='" + url + "'>");
        var img = {
            url: imgUrl,
            caption: text
        }
        imgArray.push(img);
    // $(img).appendTo(maxImageDiv);
    }
    var updateCaptionText = function() {
        var caption = photoTextArray[slideNumber];
        var textHolder = $("#divTextHolder");
        textHolder.html(caption);
    }

    var totalPhotos = function(tData) {
        var count = 0;
        for (var i = 0; i < tData.posts.length; i++) {
            for (var j = 0; j < tData.posts[i].photos.length; j++) {
                count++;
            }
        }
        return count;
    }

    this.sum = function(upto) {
        var sum = 0;
        for (var i = 0; i < upto; i++) {
            sum += postCounts[i];
        }
        // console.log("sum: ",sum);
        return sum;
    }

    this.getMorePhotos = function() {
        console.log("getting more photos");
        $.get("/tData?postLimit=" + pLimit + "&postOffset=" + postOffset, function (reTData) {
            // var newDiv = $("<div id='maximage'></div>");
            // $('body').append(newDiv);
            // $("#maximage").remove();
            imgArray = [];
            dataRetriever.totalPhotoCount += totalPhotos(reTData);
            //console.log("totalPhotoCount", totalPhotoCount);
            dataRetriever.addImages(reTData);
            // $(function(){
            //     $('#maximage').maximage({
            //         cycleOptions: {
            //             // fx:'scrollHorz',
            //             speed: 800,
            //             timeout: interval,
            //             // prev: '#arrow_left',
            //             // next: '#arrow_right'
            //         },
            //     });
            // });
            $('#maximage').rsfSlideshow('addSlides', imgArray);
            //console.log(photoSourceArray, "photo array");
            //console.log(photoBlogArray, "blog array");
            //console.log(slideNumber, "slide number");
            postOffset += pLimit;
        });
    }

    var sizeCss = function() {
        var container = $(".rs-slideshow .slide-container");
        var containerBefore = $(".rs-slideshow .slide-container:before");
        var img = $(".rs-slideshow .sliide-container img");
        var width = container.width();
        var height = container.height();
        containerBefore.height(height);
    }
    var bpmToSeconds = function(bpm) {
        return bpm / 60;
    }
    var getUrlParameter = function(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }
    //#region
    //#region METHODS

    //#region USER_DATA
    this.unsubUser = function (callback) {
        // var i = slideNumber % pLimit;
        var blogName = this.photoBlogArray[this.slideNumber];
        console.log(blogName);
        $.get("blog-info?blogName=" + blogName, function (blogData) {
            console.log("blogData", blogData);
            var blogUrl = blogData.blog.url;
            console.log("unsubbing: ", blogUrl);
            $.post("/unfollow?blogurl=" + blogUrl, function (result) {
              var err = result.error;
                if (err != undefined && err != "") {
                    callback(err);
                }
                else {
                    callback(null);
                }
            });
        });
    }

    this.subscribeBlog = function (callback) {
        var blogName = this.photoSourceArray[this.slideNumber]
        if (typeof(blogName) =="undefined" || blogName == "") return;
        $.get("blog-info?blogName=" + blogName, function (blogData) {
            console.log("blogData", blogData);
            var blogUrl = blogData.blog.url;
            console.log("subbing: ", blogUrl);
            $.post("/follow?blogurl=" + blogUrl, function (result) {
              var err = result.error;
                if (typeof (err) != "undefined" && err != "") {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    }

    this.likePost = function (callback) {
        var postId = this.photoIdArray[this.slideNumber];
        //console.log("postId: ", postId);
        var postReblogKey = this.photoReblogKeyArray[this.slideNumber];
        //console.log("reblogKey: ", postReblogKey);
        $.post("/like?postId=" + postId + "&reblogKey=" + postReblogKey, function (err, success) {
            if (typeof (err) != "undefined" && err != "") {
                callback("Error liking post: " + err);
            } else {
                callback(null);
            }
        });
    }

    this.reblogPost = function (callback) {
        var blogName = this.photoBlogArray[this.slideNumber];
        //console.log("blogName: ", blogName);
        var postId = this.photoIdArray[this.slideNumber];
        //console.log("postId: ", postId);
        var postReblogKey = this.photoReblogKeyArray[this.slideNumber];
        //console.log("reblogKey: ", postReblogKey);
        $.get("/user-info", function (user) {
            //console.log("user:" + user);
            var blogName = user.id;
            $.post("/reblog?blogName=" + blogName + "&postId=" + postId + "&reblogKey=" + postReblogKey, function (err, success) {
                if (typeof (err) != "undefined" && typeof (err.id) == undefined) {
                    callback("Error reblogging post: " + err);
                } else {
                    callback(null);
                }
            });
        });
    }
    //#endregion

    //#region IMG_DATA
    this.scaleImage = function ($img, imgW, imgH) {
        //var $img = $(".rs-slideshow .slide-container img");
        var w = window.innerWidth;
        console.log("inner window width: ", w);
        var h = window.innerHeight;
        console.log("inner window height: ", h);
        console.log("img width", imgW);
        console.log("img height", imgH);
        var newW = imgW * this.imgScale;
        var newH = imgH * this.imgScale;
        var correctedScale = this.imgScale
        // while the scale doesn't fit in the window
        var isImgTooLarge = newW > w || newH > h;
        while (isImgTooLarge && correctedScale > 1) {
            // we've done all we can do, just don't scale it.
            correctedScale -= .2;
            newW = imgW * correctedScale;
            newH = imgH * correctedScale;
            isImgTooLarge = newW > w || newH > h;
        }
        console.log("corrected scale: ", correctedScale);
        $img.css("transform", "scale(" + correctedScale + ")");
    }

    //#endregion
    $.get("/tData?postLimit=" + pLimit + "&postOffset=" + postOffset, function (tData) {
        var bpm = parseInt(getUrlParameter(strQueryBpm));
        //console.log("bpm" + bpm);
        var interval;
        if (typeof (bpm) != "undefined" && bpm > 30) {
            interval = bpmToSeconds(bpm) / 128;
        }
        else {
            interval = 10;
        }
        // var interval = 10;
        dataRetriever.totalPhotoCount += totalPhotos(tData);
        //console.log("totalPhotoCount", totalPhotoCount);
        // Prime page with photos
        console.log("tdata", tData);
        dataRetriever.addImages(tData);
        console.log(imgArray);
        var options = {
            interval: interval,
            transition: 500,
            effect: 'fade',
            easing: "swing",
            // iteration: "loop",
            slides: imgArray
        };
        postOffset += pLimit;
        console.log(options);
        $('#maximage').rsfSlideshow(options);
        $('#maximage').rsfSlideshow('nextSlide');
        //console.log(tData.posts.length, "posts");
        //console.log(photoSourceArray, "photo array");
        //console.log(photoBlogArray, "blog array");
        //console.log(slideNumber, "slide number");
    });
    //#endregion


}
dataRetriever = new tumblrDataRetriever();
