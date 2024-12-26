// Buttons
const openPageBtn = document.getElementById('openPage');
const appearanceBtn = document.getElementById('appearanceBtn');
const appearanceBackBtn = document.getElementById('appearanceBackBtn');

// Views
const mainMenu = document.getElementById('mainMenu');
const appearance = document.getElementById('appearance');

// Events
openPageBtn.addEventListener('click', () => {
  browser.tabs.create({ url: browser.runtime.getURL('../library.html') });
});

appearanceBtn.addEventListener('click', () => {
  appearance.classList.remove('hidden');
  mainMenu.classList.add('hidden');
});

appearanceBackBtn.addEventListener('click', () => {
  appearance.classList.add('hidden');
  mainMenu.classList.remove('hidden');
});

appearance.addEventListener('click', e => {
  const target = e.target;
  if (target.classList.contains('device-btn')) {
    const theme = target.dataset.theme;
    appearance.querySelector('.active').classList.remove('active');
    target.classList.add('active');
    appearanceBtn.querySelector('.btn-text').textContent = `Appearance: ${target.dataset.text}`;
    window.localStorage.setItem('theme', theme);
    setTheme(theme);
  }
});


function setTheme (theme) {
  const themeName = String(theme).charAt(0).toUpperCase() + String(theme).slice(1);
  let activeBtn = appearance.querySelector('[data-theme="device"]');
  appearanceBtn.querySelector('.btn-text').textContent = `Appearance: ${themeName} theme`;

  if (theme) {
    activeBtn = appearance.querySelector(`[data-theme="${theme}"]`);
  }
  activeBtn.classList.add('active');

  document.documentElement.className = '';
  if (theme === 'device') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.classList.add(theme);
  }

}

document.addEventListener('DOMContentLoaded', () => {
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
});

// TODO:
// (*) Create account page
// (*) Allow to save videos to watch later
// (*) Add ability to "subscribe" to channels
// (*) Add ability to remove videos from playlists
// (*) Add ability to remove channels from list
// (*) Add close button to save to popup
// (*) Fix issues with getting the proper text on copy
// (*) Add metadata to lists
// (*)   Check for type of page (home, video, search, channel, etc)
// (*)   Avatar to channels
// (*)   Channel name to video
// (*) Add styles, account page, popup, save popup
// (*) Add error handling (try/catch)
// (*) Add icon
// (*) Add GitHub repo
// (*) Allow to save videos to playlists
// (*) Add ablitity to create playlists
// (*) Create a release
// (*) Publish
 
// (*) Fix remove video from playlist
// () Add label for shorts (to indicate it'sa short)
// (*) Add more checks for avatar img
// (*) Add more checks for channel name
// () Add ability to remove playlists
// (*) Add playlists to playlist page
// () Add checks for local storage cpacity
// (*) Add dark mode (to the main extention popup)
// ( ) Download (to the main extention popup)
// ( )   Text file (to the main extention popup)
// ( )   JSON file (to the main extention popup)
// ( ) Upload JSON file(to the main extention popup)
// ( ) Clear all with confirmation (to the main extention popup)
// () Add ability to add videos from one playlist to another
// () Add local search to library
// () Add ability to save current video
