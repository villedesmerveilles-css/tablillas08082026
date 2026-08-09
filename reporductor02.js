var vdmYtApiReady = false;
var vdmDomReady = false;

if (!window.YT) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    vdmYtApiReady = true;
}

function extractYouTubeId(url) {
    if (!url) return '';
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

function onYouTubeIframeAPIReady() {
    vdmYtApiReady = true;
    vdmInitPlayers();
}

function vdmInitPlayers() {
    if (!vdmYtApiReady || !vdmDomReady) return;

    document.querySelectorAll('.VdM-MiniPlayer').forEach(function(container, index) {
        if (container._player || container.dataset.vdmInit) return;
        container.dataset.vdmInit = '1';

        var rawUrl = container.getAttribute('data-video-url') || container.getAttribute('data-video-id');
        var videoId = extractYouTubeId(rawUrl);
        var frameId = 'vdm-mini-' + index;

        var div = document.createElement('div');
        div.id = frameId;
        div.className = 'yt-hidden-frame';
        container.appendChild(div);

        if (!container.querySelector('.vdm-progress-bar')) {
            var progressBar = document.createElement('div');
            progressBar.className = 'vdm-progress-bar';
            progressBar.innerHTML = '<div class="vdm-progress-fill"></div>';
            container.appendChild(progressBar);
        }
        var fillBar = container.querySelector('.vdm-progress-fill');
        var progressInterval;

        var player = new YT.Player(frameId, {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'enablejsapi': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': function(event) {
                    container._player = event.target;
                },
                'onError': function(event) {
                    console.error('VdM-MiniPlayer: error YT código', event.data, 'video', videoId);
                },
                'onStateChange': function(event) {
                    var icon = container.querySelector('.btn-play-mini i');
                    if (event.data == YT.PlayerState.PLAYING) {
                        if (icon) icon.className = "fa-solid fa-pause";
                        progressInterval = setInterval(function() {
                            var current = player.getCurrentTime();
                            var total = player.getDuration();
                            if (total > 0) {
                                var percent = (current / total) * 100;
                                fillBar.style.width = percent + '%';
                            }
                        }, 500);
                    } else {
                        if (icon && event.data == YT.PlayerState.PAUSED) {
                            icon.className = "fa-solid fa-play";
                        }
                        clearInterval(progressInterval);
                    }
                }
            }
        });

        var playBtn = container.querySelector('.btn-play-mini');
        playBtn.addEventListener('click', function() {
            if (!container._player) return;
            var state = player.getPlayerState();
            if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
                player.pauseVideo();
            } else {
                document.querySelectorAll('.VdM-MiniPlayer').forEach(function(c) {
                    if (c._player && c !== container) {
                        c._player.pauseVideo();
                    }
                });
                player.playVideo();
            }
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        vdmDomReady = true;
        vdmInitPlayers();
    });
} else {
    vdmDomReady = true;
    vdmInitPlayers();
}
