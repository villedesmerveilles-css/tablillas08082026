if (!window.YT) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    document.querySelectorAll('.VdM-MiniPlayer').forEach(function(container, index) {
        var videoId = container.getAttribute('data-video-id');
        var frameId = 'vdm-mini-' + index;
        
        var div = document.createElement('div');
        div.id = frameId;
        div.className = 'yt-hidden-frame';
        container.appendChild(div);

        var player = new YT.Player(frameId, {
            videoId: videoId,
            playerVars: { 'autoplay': 0, 'controls': 0, 'rel': 0 },
            events: {
                'onReady': function(event) {
                    container._player = event.target;
                }
            }
        });

        var playBtn = container.querySelector('.btn-play-mini');
        playBtn.addEventListener('click', function() {
            if (!container._player) return;

            var player = container._player;
            var state = player.getPlayerState();
            var icon = playBtn.querySelector('i');

            if (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING) {
                player.pauseVideo();
                icon.className = "fa-solid fa-play";
            } else {
                document.querySelectorAll('.VdM-MiniPlayer').forEach(function(c) {
                    if (c._player && c !== container) {
                        c._player.pauseVideo();
                        var otherIcon = c.querySelector('.btn-play-mini i');
                        if(otherIcon) otherIcon.className = "fa-solid fa-play";
                    }
                });
                player.playVideo();
                icon.className = "fa-solid fa-pause";
            }
        });
    });
}
