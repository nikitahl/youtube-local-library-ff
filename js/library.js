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
        const playlistTitle = document.createElement('strong');
        playlistTitle.classList.add('title');
        playlistTitle.innerText = playlist.playlistName;
        const playlistLength = document.createElement('span');
        playlistLength.classList.add('secondary-link');
        playlistLength.innerText = `${playlist.videos.length} videos`;
        const playlistLink = document.createElement('a');
        playlistLink.classList.add('primary-link', 'view-playlist');
        playlistLink.href = `library.html?playlistName=${key}`;
        playlistLink.setAttribute('data-playlist-id', key);
        playlistLink.innerText = 'View full playlist';

        playlistContainer.appendChild(playlistTitle);
        playlistContainer.appendChild(playlistLength);
        playlistContainer.appendChild(playlistLink);
    
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
      const liOptions = {
        'data-link': channel.link,
        'data-category': 'channels',
        'data-type': 'channel'
      };
      if (playlistName) {
        liOptions['data-playlistname'] = playlistName; 
      }
      // eslint-disable-next-line
      const li = createElement('li', null,  liOptions);
      const channelLinkOptions = {
        className: 'secondary-link',
        href: channel.link,
        title: channel.linkText,
        target: '_blank'
      };
      // eslint-disable-next-line
      const channelLink = createElement('a', channel.linkText, channelLinkOptions);
      const btnAttributes = {
        title: 'Remove',
        className: 'remove-item'
      };
      // eslint-disable-next-line
      const removeBtn = createElement('button', null, btnAttributes);
      const template = document.querySelector('#removeSvgTemplate');
      const clone = template.content.cloneNode(true);
      removeBtn.appendChild(clone);
      const avatarOptions = {
        className: 'avatar'
      };
      // avatar.classList.add('avatar');
      if (channel?.linkMeta?.avatar) {
        avatarOptions.src = channel.linkMeta.avatar;
        avatarOptions.loading = 'lazy';
      }
      // eslint-disable-next-line
      const avatar = createElement('img', null , avatarOptions);
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