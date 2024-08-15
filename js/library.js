document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line
  const url = new URL(window.location.href);
  const currentPlaylistContainer = document.getElementById('currentPlaylist');
  const playlistsContainer = document.getElementById('playlists');
  const channelsList = document.getElementById('channelsList');

  const playlistTitle = document.getElementById('playlistTitle');
  let playlistName = url.searchParams.get('playlistName');
  console.log('playlistName',playlistName);
  if (!playlistName) {
    playlistName = 'watchLater';
  }
  console.log('playlistName',playlistName);
  browser.storage.local.get([ 'playlists' ], result => {
    console.log('result.playlists',result.playlists);
    const playlist = result.playlists && result.playlists[playlistName];
    if (playlist) {
      playlistTitle.innerText = playlist.playlistName;
      if (playlist.videos.length) {
      // eslint-disable-next-line
      renderVideos(playlist.videos, currentPlaylistContainer, 'playlists', playlistName); // defined in utils.js
      } else {
        const content = 'You have no videos saved in this playlist.';
        renderNoContent(content, currentPlaylistContainer);
      }
    } else {
      const content = 'You have no videos saved in this playlist.';
      renderNoContent(content, currentPlaylistContainer);
    }
  });

  browser.storage.local.get({ playlists: [] }, result => {
    const playlists = result.playlists;
    if (Object.keys(playlists).length === 0) {
      const content = 'You have no playlists.';
      renderNoContent(content, playlistsContainer);
      return;
    }
    for (const key in playlists) {
      if (Object.hasOwnProperty.call(playlists, key)) {
        const playlist = playlists[key];
        const playlistContainer = document.createElement('div');
        playlistContainer.classList.add('playlist');
        playlistContainer.innerHTML = `<strong class="title">${playlist.playlistName}</strong>
        <span class="secondary-link">${playlist.videos.length} videos</span>
        <a class="primary-link view-playlist" data-playlist-id="${key}" href="library.html?playlistName=${key}">View full playlist</a>
        `;
        playlistsContainer.appendChild(playlistContainer);
      }
    }
  });

  // Fetch saved channels from localStorage
  browser.storage.local.get({ channels: [] }, result => {
    const savedChannels = result.channels.general;
    console.log('savedChannels',savedChannels);
    if (!savedChannels || !savedChannels.length) {
      const content = 'You have no saved channels.';
      renderNoContent(content, channelsList);
      return;
    }
    savedChannels && savedChannels.forEach(channel => {
      const li = document.createElement('li');
      const channelLink = document.createElement('a');
      const removeBtn = document.createElement('button');
      const avatar = document.createElement('img');
      li.dataset.link = channel.link;
      li.dataset.category = 'channels';
      li.dataset.type = 'channel';
      channelLink.href = channel.link;
      channelLink.textContent = channel.linkText;
      channelLink.title = channel.linkText;
      channelLink.target = '_blank';
      channelLink.classList.add('secondary-link');
      removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inherit;" aria-hidden="true"><path d="M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z"></path></svg>';
      removeBtn.title = 'Remove';
      removeBtn.classList.add('remove-item');
      avatar.classList.add('avatar');
      if (channel?.linkMeta?.avatar) {
        avatar.src = channel.linkMeta.avatar;
        avatar.loading = 'lazy';
      }
      li.appendChild(avatar);
      li.appendChild(channelLink);
      li.appendChild(removeBtn);
      channelsList.appendChild(li);
    });
  });
});

function renderNoContent (content, container) {
  const tag = 'p';
  const attributes = {};
  // eslint-disable-next-line
  const noContent = createElement(tag, content, attributes);
  container.append(noContent);
}