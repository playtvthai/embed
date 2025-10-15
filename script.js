const playlist = [
  {
    name: "ช่อง 7 HD",
    resolveUrl: "http://mains.services/live/bshorty/Zv5le07a0J/3a3f7ae8-8967-4580-b030-4a66fea7167b.m3u8"
  },
  {
    name: "ช่อง 3 HD",
    resolveUrl: "http://mains.services/live/bshorty/Zv5le07a0J/6048d24e-681a-41ce-b7f6-0ed78c7d5f55.m3u8"
  }
];

const video = document.getElementById('video');
const status = document.getElementById('status');
const select = document.getElementById('channelSelect');
let hls;
let refreshInterval;

if (!localStorage.getItem("loggedIn")) {
  location.href = "login.html";
}

playlist.forEach((item, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.textContent = item.name;
  select.appendChild(opt);
});

select.addEventListener('change', () => playChannel(parseInt(select.value)));
playChannel(0);

async function playChannel(index) {
  clearInterval(refreshInterval);
  const channel = playlist[index];
  const m3u8 = await fetchStream(channel.resolveUrl);
  if (!m3u8) {
    status.textContent = "❌ ไม่พบลิงก์";
    return;
  }
  if (hls) hls.destroy();
  hls = new Hls();
  hls.attachMedia(video);
  hls.loadSource(m3u8);
  hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
  status.textContent = `▶️ Playing ${channel.name}`;

  refreshInterval = setInterval(async () => {
    const newUrl = await fetchStream(channel.resolveUrl);
    if (newUrl) {
      hls.loadSource(newUrl);
      video.play();
      status.textContent = `✅ Refresh: ${channel.name}`;
    }
  }, 5 * 60 * 1000);
}

async function fetchStream(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const match = text.match(/(http[^"']+\.m3u8[^"']*)/i);
    return match ? match[1] : null;
  } catch (e) {
    console.error(e);
    return null;
  }
}
