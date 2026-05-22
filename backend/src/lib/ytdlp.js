import youtubedl from 'youtube-dl-exec';
import NodeCache from 'node-cache';

const CACHE_TTL = Number(process.env.CACHE_TTL) || 3600;
const YTDLP_PATH = process.env.YTDLP_PATH || undefined;

const metaCache = new NodeCache({ stdTTL: CACHE_TTL, checkperiod: 600 });
const streamUrlCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const ytdl = YTDLP_PATH ? youtubedl.create(YTDLP_PATH) : youtubedl;

const COMMON_OPTS = {
  noWarnings: true,
  noCallHome: true,
  preferFreeFormats: true,
  geoBypass: true,
};

export async function searchYouTube(query, limit = 20) {
  const key = `search:${query}:${limit}`;
  const cached = metaCache.get(key);
  if (cached) return cached;

  const result = await ytdl(`ytsearch${limit}:${query}`, {
    ...COMMON_OPTS,
    dumpSingleJson: true,
    flatPlaylist: true,
    skipDownload: true,
  });

  const tracks = (result?.entries || [])
    .filter((e) => e && e.id)
    .map(toTrackSummary);

  metaCache.set(key, tracks);
  return tracks;
}

export async function getVideoInfo(id) {
  const key = `info:${id}`;
  const cached = metaCache.get(key);
  if (cached) return cached;

  const info = await ytdl(`https://www.youtube.com/watch?v=${id}`, {
    ...COMMON_OPTS,
    dumpSingleJson: true,
    skipDownload: true,
  });

  const track = toTrackDetail(info);
  metaCache.set(key, track);
  return track;
}

export async function getAudioStreamUrl(id) {
  const cached = streamUrlCache.get(id);
  if (cached) return cached;

  const info = await ytdl(`https://www.youtube.com/watch?v=${id}`, {
    ...COMMON_OPTS,
    dumpSingleJson: true,
    skipDownload: true,
    format: 'bestaudio[ext=m4a]/bestaudio/best',
  });

  const url = info?.url || pickBestAudioFormat(info?.formats)?.url;
  if (!url) throw new Error('Stream URL not found');

  const payload = {
    url,
    mimeType: info?.ext === 'm4a' ? 'audio/mp4' : `audio/${info?.ext || 'mpeg'}`,
    duration: info?.duration,
  };
  streamUrlCache.set(id, payload);
  return payload;
}

function pickBestAudioFormat(formats = []) {
  const audioOnly = formats.filter((f) => f.acodec && f.acodec !== 'none' && (!f.vcodec || f.vcodec === 'none'));
  audioOnly.sort((a, b) => (b.abr || 0) - (a.abr || 0));
  return audioOnly[0];
}

function toTrackSummary(e) {
  return {
    id: e.id,
    title: e.title || 'Senza titolo',
    artist: e.uploader || e.channel || '',
    duration: e.duration || 0,
    thumbnail: pickThumbnail(e),
    url: e.url || `https://www.youtube.com/watch?v=${e.id}`,
  };
}

function toTrackDetail(info) {
  return {
    id: info.id,
    title: info.title || 'Senza titolo',
    artist: info.uploader || info.channel || '',
    artistId: info.channel_id || info.uploader_id || '',
    album: info.album || '',
    duration: info.duration || 0,
    thumbnail: pickThumbnail(info),
    description: info.description || '',
    uploadDate: info.upload_date || '',
    viewCount: info.view_count || 0,
    url: info.webpage_url || `https://www.youtube.com/watch?v=${info.id}`,
  };
}

function pickThumbnail(info) {
  if (info.thumbnail) return info.thumbnail;
  const thumbs = info.thumbnails || [];
  if (!thumbs.length) return `https://i.ytimg.com/vi/${info.id}/hqdefault.jpg`;
  const sorted = [...thumbs].sort((a, b) => (b.width || 0) - (a.width || 0));
  return sorted[0]?.url;
}
