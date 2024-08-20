const { URL } = window;
// eslint-disable-next-line
function renderVideos(videos, container, category, playlistName = null) { // used in library.js
  videos && videos.forEach(video => {
    const link = video.link;
    const videoId = new URL(link).searchParams.get('v');
    const embedOptions = {
      className: 'video-embed',
      loading: 'lazy',
      src: `https://www.youtube.com/embed/${videoId}`,
      title: 'YouTube video player',
      frameborder: '0',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
      referrerPolicy: 'strict-origin-when-cross-origin',
      allowFullscreen: true
    };
    const embed = createElement('iframe', null, embedOptions);
    const liOptions = {
      'data-link': link,
      'data-category': category,
      'data-type': 'video'
    };
    if (playlistName) {
      liOptions['data-playlistname'] = playlistName; 
    }
    const li = createElement('li', null,  liOptions);
    const removeBtnWrapper = createElement('div', null, { className: 'remove-wrapper' });
    const contentWrapper = createElement('div', null, { className: 'video-content' });
    const channelLinkOptions = {
      className: 'secondary-link',
      href: video.linkMeta.channelLink,
      title: video.linkMeta.channelName,
      target: '_blank'
    };
    const channelLink = createElement('a', video.linkMeta.channelName, channelLinkOptions);
    const videoName = video.linkText || 'No video title ...';
    const videoLinkOptions = {
      className: 'primary-link',
      href: link,
      title: videoName, 
      target: '_blank'
    };
    const videoLink = createElement('a', videoName, videoLinkOptions);
    const btnAttributes = {
      title: 'Remove',
      className: 'remove-item'
    };
    const removeBtn = createElement('button', null, btnAttributes);
    const template = document.querySelector('#removeSvgTemplate');
    const clone = template.content.cloneNode(true);

    removeBtn.appendChild(clone);
    li.appendChild(embed);
    li.appendChild(contentWrapper);
    li.appendChild(removeBtnWrapper);
    contentWrapper.appendChild(videoLink);
    contentWrapper.appendChild(channelLink);
    removeBtnWrapper.appendChild(removeBtn);
    container.appendChild(li);
  });
}

document.body.addEventListener('click', e => {
  const item = e.target.closest('li');
  const type = item?.dataset?.type;
  if (e.target.tagName === 'BUTTON' && e.target.classList.contains('remove-item') && window.confirm(`Do you really want to remove this ${type}?`)) {
    const link = item.dataset.link;
    const category = item.dataset.category;
    const playlistName = item.dataset.playlistname;
    removeFromLocalStorage(category, link, playlistName);
    item.remove();
  }
});

function removeFromLocalStorage(category, link, playlistName = null) {
  browser.storage.local.get([ category ], result => {
    let items = result[category] || {};
    let save = false;

    console.log('removeFromLocalStorage', { result, category, link, playlistName, items });
    if (playlistName) {
      if (items[playlistName] && items[playlistName].videos.find(item => item.link === link)) {
        items[playlistName].videos = items[playlistName].videos.filter(item => item.link !== link);
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

// eslint-disable-next-line
function createElement (tag, content = null, attributes) { // used in library.js
  const element = document.createElement(tag);
  if (content) {
    element.textContent = content;
  }

  // Assign other attributes, including data-* attributes
  for (const [ key, value ] of Object.entries(attributes)) {
    if (key.startsWith('data-')) {
      element.setAttribute(key, value);
    } else {
      element[key] = value;
    }
  }
  if (tag === 'li') {
    console.log('attributes', attributes);
  }
  return Object.assign(element, attributes);
}