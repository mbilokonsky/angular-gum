angular.module("myk.camera", [])
.service("Camera", function() {
        var listeners = [];
        var camera = {
            videoElement: null,
            stream: null,
            streamUrl: null,
            isReady: false,
            register: function(callback) {
                if (camera.isReady) {
                    return callback();
                }

                listeners.push(callback);
            }
        }

        var videoElement;
        videoElement = document.createElement('video');
        videoElement.autoplay = true;
        videoElement.muted = true;

        window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

        navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);

        navigator.getMedia({ video: true, audio: true }, function (stream) {

            camera.streamUrl = window.URL.createObjectURL(stream);
            camera.videoElement = videoElement;
            camera.stream = stream;
            camera.dimensions = {width: videoElement.videoWidth || 640, height: videoElement.videoHeight || 480};
            videoElement.play();

            videoElement.src = camera.streamUrl;

            camera.isReady = true;
            listeners.forEach(function(callback) {
                callback(camera.videoElement);
            });

            listeners = [];

        }, function(err) {
            console.error(err);
        });

        return camera;
    });