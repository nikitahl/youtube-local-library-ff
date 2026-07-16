document.addEventListener('DOMContentLoaded', () => {
  const url = new URL(window.location.href);
  const { DOMParser } = window;
  const parser = new DOMParser();
  const currentPlaylistContainer = document.getElementById('currentPlaylist');
  const playlistsContainer = document.getElementById('playlists');
  const channelsList = document.getElementById('channelsList');
  const playlistMoreIcon = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" aria-hidden="true" style="pointer-events: none;"><path fill="var(--color)" d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"></path></svg>';
  let isOptionsOpened = false;

  const playlistTitle = document.getElementById('playlistTitle');
  let playlistName = url.searchParams.get('playlistName');
  if (!playlistName) {
    playlistName = 'watchLater';
  }
  browser.storage.local.get([ 'playlists' ], result => {
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
        const playlistMore = document.createElement('button');
        playlistMore.title = 'Options';
        playlistMore.classList.add('playlist-more');
        const playlistMoreIconElement = parser.parseFromString(playlistMoreIcon, 'text/html').body.firstChild;

        playlistMore.appendChild(playlistMoreIconElement);
        playlistContainer.appendChild(playlistTitle);
        playlistContainer.appendChild(playlistLength);
        playlistContainer.appendChild(playlistLink);
        playlistContainer.appendChild(playlistMore);
    
        playlistsContainer.appendChild(playlistContainer);
      }
    }
  });

  // Fetch saved channels from localStorage
  chrome.storage.local.get({ channels: [] }, result => {
    const savedChannels = result.channels.general;
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
      const li = createElement('li', null,  liOptions);
      const channelLinkOptions = {
        className: 'secondary-link',
        href: channel.link,
        title: channel.linkText,
        target: '_blank'
      };
      const channelLink = createElement('a', channel.linkText, channelLinkOptions);
      const btnAttributes = {
        title: 'Remove',
        className: 'remove-item'
      };
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
      const avatar = createElement('img', null , avatarOptions);
      li.appendChild(avatar);
      li.appendChild(channelLink);
      li.appendChild(removeBtn);
      channelsList.appendChild(li);
    });
  });

  function renderNoContent (content, container) {
    const tag = 'p';
    const attributes = {};
    const noContent = createElement(tag, content, attributes);
    container.append(noContent);
  }
  
  function setTheme (theme) {
    document.documentElement.className = '';
    if (theme === 'device') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(theme);
    }
  }

  function handlePlaylistContainerClick (e) {
    const target = e.target;
    if (target.classList.contains('playlist-more') && !target.classList.contains('active')) {
      const playlist = target.closest('.playlist');
      playlist.classList.add('active');
      target.classList.add('active');
      const dropdown = createElement('div', null, { className: 'playlist-options' });
      const removeBtn =  createElement('button', 'Remove playlist', { className: 'playlist-remove' });
      const template = document.querySelector('#removeSvgTemplate');
      const clone = template.content.cloneNode(true);
      removeBtn.prepend(clone);
      dropdown.appendChild(removeBtn);
      playlist.appendChild(dropdown);

      isOptionsOpened = true;
      setTimeout(() => {
        document.addEventListener('click', handleDocumentClick);
      }, 0);
    } else if (target.classList.contains('playlist-remove')) {
      if (window.confirm('Do you really want to remove this playlist?')) {
        const playlistContainer = target.closest('.playlist');
        const playlistName = playlistContainer.querySelector('.primary-link').getAttribute('data-playlist-id');
        browser.storage.local.get([ 'playlists' ], result => {
          const playlists = result.playlists;
          try{
            delete playlists[playlistName];
            browser.storage.local.set({ 'playlists': playlists });
            removeOptionsPopup();
            playlistContainer.remove();
          } catch (e) {
            console.error(`Unable to delete a playlist ${playlistName}: `, e);
          }
        });
      }
    }
  }

  function handleDocumentClick (e) {
    const target = e.target;
    if (isOptionsOpened && !target.classList.contains('playlist-remove')) {
      removeOptionsPopup();
    }
  }

  function removeOptionsPopup () {
    const playlist = document.querySelector('.playlist.active');
    const options = playlist.querySelector('.playlist-options');
    const optionsBtn = playlist.querySelector('.playlist-more');
    options.remove();
    playlist.classList.remove('active');
    optionsBtn.classList.remove('active');

    isOptionsOpened = false;
    document.removeEventListener('click', handleDocumentClick);
  }
  
  function addClickEvents () {
    playlistsContainer.addEventListener('click', handlePlaylistContainerClick);
  }
  
  function addThemeEvents () {
    const savedTheme = window.localStorage.getItem('theme') || 'device';
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleDeviceThemeChange = () => setTheme('device');
  
    setTheme(savedTheme);
  
    window.addEventListener('storage', e => {
      if (e.key === 'theme') {
        setTheme(e.newValue);
        if (e.newValue === 'device' && !mediaQuery.onchange) {
          mediaQuery.addEventListener('change', handleDeviceThemeChange);
        } else {
          mediaQuery.removeEventListener('change', handleDeviceThemeChange);
        }
      }
    });
  }

  addThemeEvents();
  addClickEvents();
});
