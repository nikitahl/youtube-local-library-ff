document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line
  const url = new URL(window.location.href);
  const playlistName = url.searchParams.get('playlistName');
  const playlistTitle = document.getElementById('playlistTitle');
  const playlistContainer = document.getElementById('playlist');

  chrome.storage.local.get([ 'playlists' ], result => {
    const playlist = result.playlists[playlistName];
    if (playlist) {
      playlistTitle.innerText = playlist.playlistName;
      // eslint-disable-next-line
      renderVideos(playlist.videos, playlistContainer, 'playlists', playlist.playlistName); // defined in utils.js
    } else {
      console.error('No playlist data found');
    }
  });
});