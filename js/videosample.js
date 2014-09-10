/// <reference path='./typings/webrtc/MediaStream.d.ts' />
/// <reference path='./typings/peerjs/Peer.d.ts' />
/// <reference path='./typings/jquery.d.ts' />
var PeerJsSample;
(function (PeerJsSample) {
    var VideoSample = (function () {
        function VideoSample() {
            var _this = this;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            var peer = new Peer({ key: 'lwjd5qra8257b9', debug: 3 });
            peer.on('open', function () {
                console.log("openpeer");
                console.log(peer.id);
                $('#my-id').text(peer.id);
            });

            peer.on('call', function (call) {
                // Answer the call automatically (instead of prompting user) for demo purposes
                call.answer(window.localStream);
                _this._step3(call);
            });

            peer.on('error', function (err) {
                console.log(err.message);

                // Return to step 2 if error occurs
                _this._step2();
            });

            $('#make-call').click(function () {
                // Initiate a call!
                var call = peer.call($('#callto-id').val(), window.localStream);

                _this._step3(call);
            });

            $('#end-call').click(function () {
                window.existingCall.close();
                _this._step2();
            });

            // Retry if getUserMedia fails
            $('#step1-retry').click(function () {
                $('#step1-error').hide();
                _this._step1();
            });

            // Get things started
            this._step1();
        }
        VideoSample.prototype._step1 = function () {
            var _this = this;
            navigator.getUserMedia({ audio: true, video: true }, function (stream) {
                // Set your video displays
                $('#my-video').prop('src', URL.createObjectURL(stream));

                window.localStream = stream;
                _this._step2();
            }, function () {
                $('#step1-error').show();
            });
        };

        VideoSample.prototype._step2 = function () {
            $('#step1, #step3').hide();
            $('#step2').show();
            console.log($("#step2"));
        };

        VideoSample.prototype._step3 = function (call) {
            // Hang up on an existing call if present
            if (window.existingCall) {
                window.existingCall.close();
            }

            // Wait for stream on the call, then set peer video display
            call.on('stream', function (stream) {
                $('#their-video').prop('src', URL.createObjectURL(stream));
            });

            // UI stuff
            window.existingCall = call;
            $('#their-id').text(call.peer);
            call.on('close', this._step2);
            $('#step1, #step2').hide();
            $('#step3').show();
        };
        return VideoSample;
    })();
    PeerJsSample.VideoSample = VideoSample;
})(PeerJsSample || (PeerJsSample = {}));
//# sourceMappingURL=videosample.js.map
