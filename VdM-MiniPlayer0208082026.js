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

        // Asegurar barra de progreso
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
                'onStateChange': function(event) {
                    var icon = container.querySelector('.btn-play-mini i');
                    if (event.data == YT.PlayerState.PLAYING) {
                        if(icon) icon.className = "fa-solid fa-pause";
                        progressInterval = setInterval(function() {
                            var current = player.getCurrentTime();
                            var total = player.getDuration();
                            if (total > 0) {
                                var percent = (current / total) * 100;
                                fillBar.style.width = percent + '%';
                            }
                        }, 500);
                    } else {
                        if(icon && event.data == YT.PlayerState.PAUSED) {
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
                // Pausar los demás reproductores en la página
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
