(function () {

    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('user')) {
        var victim_initial = searchParams.get('user');
    }

    if (searchParams.has('bully')) {
        var bully_initial = searchParams.get('bully');
    }

    function init_victim_initial() {
        $("#victim_smiley").first().text(victim_initial);
        $("#bully_smiley").first().text(bully_initial);
    }

    var bully_transitions = [bully_initial, "😠", "😐", "😶"];
    var victim_smile = "🙂";

    var bully_state = 1;
    var states = ["state_1", "state_2", "state_3", "state_4"];


    // hacky but ok..
    function switch_state(modifier) {
        next_bully_state = bully_state + modifier;
        if (next_bully_state >= 1 && next_bully_state <= 4) {
            next_victim_state = 5 - next_bully_state;
            victim_state = 5 - bully_state;
            next_bully_smiley = bully_transitions[next_bully_state - 1];

            if (modifier > 0) {
                $("#victim_smiley").first().text(victim_smile);
            } else {
                $("#victim_smiley").first().text(victim_initial);
            }

            $("#bully_smiley").first().text(next_bully_smiley);

            $("#bully_smiley").first().removeClass(states[bully_state - 1]);
            $("#bully_smiley").first().addClass(states[next_bully_state - 1]);
            $("#victim_smiley").first().removeClass(states[victim_state - 1]);
            $("#victim_smiley").first().addClass(states[next_victim_state - 1]);

            bully_state = next_bully_state;
            return [next_bully_state, next_victim_state];
        }
    }


    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.

    var width = 640;    // We will scale the photo width to this
    var height = 480;     // This will be computed based on the input stream

    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.

    var streaming = false;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;

    function startup() {
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        startbutton = document.getElementById('startbutton');

        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia(
            {
                video: true,
                audio: false
            },
            function (stream) {
                if (navigator.mozGetUserMedia) {
                    video.mozSrcObject = stream;
                } else {
                    var vendorURL = window.URL || window.webkitURL;
                    video.src = vendorURL.createObjectURL(stream);
                }
                video.play();
            },
            function (err) {
                console.log("An error occured! " + err);
            }
        );

        video.addEventListener('canplay', function (ev) {
            if (!streaming) {
                height = video.videoHeight / (video.videoWidth / width);

                // Firefox currently has a bug where the height can't be read from
                // the video, so we will make assumptions if this happens.

                if (isNaN(height)) {
                    height = width / (4 / 3);
                }

                video.setAttribute('width', width);
                video.setAttribute('height', height);
                canvas.setAttribute('width', width);
                canvas.setAttribute('height', height);
                streaming = true;
            }
        }, false);

    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.

    function takepicture() {
        var context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        canvas.toBlob(function (blob) {
            sendData(blob);
        }, 'image/jpeg', 0.95);
    }

    function sendData(data) {

        var params = {
            // Request parameters
        };

        $.ajax({
            url: "https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize?" + $.param(params),
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", "3a018b4f8aa24c87847653c6b6128f43");
            },
            type: "POST",
            // Request body
            data: data,
            processData: false,
            contentType: false
        }).fail(function (error) {
            console.log(error.getAllResponseHeaders());
        }).always(function (data) {
            var happy = is_result_happy(data);
            console.log(happy);
            if (happy) {
                switch_state(1);
            } else {
                switch_state(-1);
            }
            setTimeout(function () {
                takepicture()
            }, 2500);
        });
    }

    function is_result_happy(data) {
        if (data.length < 1 || !('scores' in data[0])) {
            return false;
        } else {
            var happiness = data[0]['scores']['happiness'];
            return happiness > data[0]['scores']['anger'] &&
                happiness > data[0]['scores']['contempt'] &&
                happiness > data[0]['scores']['disgust'] &&
                happiness > data[0]['scores']['fear'] &&
                happiness > data[0]['scores']['neutral'] &&
                happiness > data[0]['scores']['sadness'] &&
                happiness > data[0]['scores']['surprise'];
        }
    }

    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', init_victim_initial, false);
    window.addEventListener('load', startup, false);
    window.addEventListener('load', takepicture, false);
    window.takePicture = takepicture;
    window.switch_state = switch_state;
})();
