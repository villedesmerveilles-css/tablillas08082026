function togglePlay(btn) {
    var playerCard = btn.closest('.VdM-SinglePlayer');
    var audio = playerCard.querySelector('.VdM-audio-src');
    var icon = btn.querySelector('i');

    if (audio.paused) {
        // Pausa otros audios para que no suenen dos a la vez
        document.querySelectorAll('.VdM-audio-src').forEach(a => {
            if(a !== audio) {
                a.pause();
                a.closest('.VdM-SinglePlayer').querySelector('.VdM-play-btn i').className = "fa-solid fa-play";
            }
        });

        audio.play();
        icon.className = "fa-solid fa-pause";
    } else {
        audio.pause();
        icon.className = "fa-solid fa-play";
    }
}
