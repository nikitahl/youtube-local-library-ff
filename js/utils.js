const { URL } = window;
// eslint-disable-next-line
function renderVideos(videos, container) { // used in playlists.js and library.js
  videos && videos.forEach(video => {
    const li = document.createElement('li');
    const videoLink = document.createElement('a');
    const channelLink = document.createElement('a');
    const removeBtn = document.createElement('button');
    const removeBtnWrapper = document.createElement('div');
    const contentWrapper = document.createElement('div');
    const link = video.link;
    const videoId = new URL(link).searchParams.get('v');
    const embedHTML = `<iframe
    class="video-embed"
    loading="lazy"
    src="https://www.youtube.com/embed/${videoId}"
    title="YouTube video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>`;
    li.dataset.link = link;
    li.dataset.category = 'watchlist';
    li.dataset.type = 'video';
    li.insertAdjacentHTML('afterbegin', embedHTML);
    contentWrapper.classList.add('video-content');
    removeBtnWrapper.classList.add('remove-wrapper');
    channelLink.classList.add('secondary-link');
    channelLink.href = video.linkMeta.channelLink;
    channelLink.textContent = video.linkMeta.channelName;
    channelLink.title = video.linkMeta.channelName;
    videoLink.classList.add('primary-link');
    videoLink.href = link;
    videoLink.title = video.linkText || 'No video title ...';
    videoLink.textContent = video.linkText || 'No video title ...';
    videoLink.target = '_blank';
    removeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events: none; display: inherit;" aria-hidden="true"><path d="M11 17H9V8h2v9zm4-9h-2v9h2V8zm4-4v1h-1v16H6V5H5V4h4V3h6v1h4zm-2 1H7v15h10V5z"></path></svg>';
    removeBtn.title = 'Remove';
    removeBtn.classList.add('remove-item');
    li.appendChild(contentWrapper);
    li.appendChild(removeBtnWrapper);
    contentWrapper.appendChild(videoLink);
    contentWrapper.appendChild(channelLink);
    removeBtnWrapper.appendChild(removeBtn);
    container.appendChild(li);
  });

  document.body.addEventListener('click', e => {
    const item = e.target.closest('li');
    const type = item?.dataset?.type;
    if (e.target.tagName === 'BUTTON' && e.target.classList.contains('remove-item') && window.confirm(`Do you really want to remove this ${type}?`)) {
      const link = item.dataset.link;
      const category = item.dataset.category;
      removeFromLocalStorage(category, link);
      item.remove();
    }
  });

  function removeFromLocalStorage(category, link, playlistName = null) {
    browser.storage.local.get([ category ], result => {
      let items = result[category] || {};
      let save = false;

      if (playlistName) {
        if (items[playlistName] && items[playlistName].find(item => item.link === link)) {
          items[playlistName] = items[playlistName].filter(item => item.link !== link);
          save = true;
        }
      } else {
        if (items.general && items.general.find(item => item.link === link)) {
          items.general = items.general.filter(item => item.link !== link);
          save = true;
        }
      }

      if (save) {
        browser.storage.local.set({ [category]: items }, () => {
          console.log(`${category} removed:`, link);
        });
      } else {
        console.log(`${link} does not exist in ${category}`);
      }
    });
  }
}