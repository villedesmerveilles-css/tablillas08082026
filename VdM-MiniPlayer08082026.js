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
            height: '0',
            width: '0',
            videoId: videoId,
            playerVars: { 'autoplay': 0, 'controls': 0 }
        });

        container._player = player;

        var playBtn = container.querySelector('.btn-play-mini');
        playBtn.addEventListener('click', function() {
            var state = player.getPlayerState();
            var icon = playBtn.querySelector('i');

            if (state == YT.PlayerState.PLAYING) {
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
