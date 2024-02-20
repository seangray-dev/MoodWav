export interface SpotifyExternalUrls {
  spotify: string;
}

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  external_urls: SpotifyExternalUrls;
  followers?: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  popularity: number;
  type: 'artist';
  uri: string;
}

export interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: {
    reason: string;
  };
  type: 'album';
  uri: string;
  artists: SpotifyArtist[];
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean?: string;
    upc?: string;
  };
  external_urls: SpotifyExternalUrls;
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: object;
  known: any;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: 'track';
  uri: string;
  is_local: boolean;
}

export interface SpotifyRecentlyPlayedItem {
  track: SpotifyTrack;
  played_at: string;
  context?: {
    type: string;
    href: string;
    external_urls: SpotifyExternalUrls;
    uri: string;
  };
}

export interface SpotifyRecentlyPlayedResponse {
  href: string;
  limit: number;
  next: string | null;
  cursors: {
    after: string | null;
    before: string | null;
  };
  total: number;
  items: SpotifyRecentlyPlayedItem[];
}

export interface TrackDetail {
  id: string;
  name: string;
  artistName: string;
  coverArt: string;
  mood: string;
}

export interface SpotifyUserProfile {
  display_name: string;
  images: SpotifyImage[];
}
