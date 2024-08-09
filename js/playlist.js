document.addEventListener('DOMContentLoaded', () => {
  const playlistTitle = document.getElementById('playlistTitle');
  const playlistContainer = document.getElementById('playlist');

  browser.storage.local.get([ 'selectedPlaylist' ], result => {
    const playlist = result.selectedPlaylist;
    if (playlist) {
      playlistTitle.innerText = playlist.playlistName;
      // eslint-disable-next-line
      renderVideos(playlist.videos, playlistContainer); // defined in utils.js
    } else {
      console.error('No playlist data found');
    }
  });
});