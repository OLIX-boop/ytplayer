export interface TrackSummary {
  id: string;
  title: string;
  artist: string;
  duration: number;
  thumbnail: string;
  url: string;
}

export interface TrackDetail extends TrackSummary {
  artistId: string;
  album: string;
  description: string;
  uploadDate: string;
  viewCount: number;
}

export interface SearchResponse {
  query: string;
  count: number;
  tracks: TrackSummary[];
}

export interface StreamUrlResponse {
  url: string;
  mimeType: string;
  duration?: number;
}
