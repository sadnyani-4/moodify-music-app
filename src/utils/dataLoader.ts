// src/utils/dataLoader.ts
import Papa from 'papaparse';

interface MusicDataRaw { // Interface to match the raw CSV structure
  '': string; // The empty header for the serial number
  track_id: string;
  artists: string;
  album_name: string;
  track_name: string;
  popularity: string; // Parsed as string initially due to dynamicTyping
  duration_ms: string;
  explicit: string;
  danceability: string;
  energy: string;
  key: string;
  loudness: string;
  mode: string;
  speechiness: string;
  acousticness: string;
  instrumentalness: string;
  liveness: string;
  valence: string;
  tempo: string;
  time_signature: string;
  track_genre: string;
  [key: string]: unknown; // Changed 'any' to 'unknown'
}

interface MusicData { // Interface for your application's use
  track_id: string;
  artists: string;
  album_name: string;
  track_name: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
  track_genre: string;
}

async function loadMusicData(): Promise<MusicData[]> {
  try {
    const response = await fetch('/unique_songs.csv');
    const text = await response.text();

    // Log the last 500 characters of the text
    console.log('Last 500 characters of CSV:', text.slice(-500));

    const result = Papa.parse<MusicDataRaw>(text, { header: true, dynamicTyping: false }); // Parse all as strings initially
    const { data, errors } = result;

    if (errors && errors.length > 0) {
      console.error('Error parsing CSV:', errors);
      return [];
    }

    // Transform the raw data to your desired MusicData format, skipping the first column
    const transformedData: MusicData[] = data.map(row => ({
      track_id: row.track_id,
      artists: row.artists,
      album_name: row.album_name,
      track_name: row.track_name,
      popularity: parseInt(row.popularity),
      duration_ms: parseInt(row.duration_ms),
      explicit: row.explicit === 'True', // Or handle 'False' accordingly
      danceability: parseFloat(row.danceability),
      energy: parseFloat(row.energy),
      key: parseInt(row.key),
      loudness: parseFloat(row.loudness),
      mode: parseInt(row.mode),
      speechiness: parseFloat(row.speechiness),
      acousticness: parseFloat(row.acousticness),
      instrumentalness: parseFloat(row.instrumentalness),
      liveness: parseFloat(row.liveness),
      valence: parseFloat(row.valence),
      tempo: parseFloat(row.tempo),
      time_signature: parseInt(row.time_signature),
      track_genre: row.track_genre,
    }));

    // Basic data cleaning (remove rows where track_id is empty after the shift)
    const filteredData = transformedData.filter(row => row.track_id !== undefined && row.track_id !== '');
    return filteredData;
  } catch (error) {
    console.error('Error loading CSV:', error);
    return [];
  }
}

export default loadMusicData;