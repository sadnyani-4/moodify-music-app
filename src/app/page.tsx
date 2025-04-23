'use client';

import { useEffect, useState } from 'react';
import loadMusicData from '@/utils/dataLoader';
import Image from 'next/image';

interface MusicData {
  track_id: string;
  artists: string;
  track_name: string;
  valence: number;
  energy: number;
  tempo: number;
  acousticness: number;
  danceability: number;
  loudness: number;
  speechiness: number;
  // Removed: [key: string]: unknown;
}

const INITIAL_LOAD_LIMIT = 15;

const moodsConfig = [
  { name: 'Joy', imageSrc: '/moodify-music-app/joy.png', filter: (song: MusicData) => song.valence > 0.7 && song.energy > 0.6 && song.tempo > 120 && song.acousticness < 0.4 && song.danceability > 0.5 },
  { name: 'Sadness', imageSrc: '/moodify-music-app/sadness.png', filter: (song: MusicData) => song.valence < 0.3 && song.energy < 0.4 && song.tempo < 100 && song.acousticness > 0.6 && song.loudness < -8 },
  { name: 'Anger', imageSrc: '/moodify-music-app/anger.png', filter: (song: MusicData) => song.valence < 0.4 && song.energy > 0.7 && song.loudness < -5 && song.tempo > 110 && song.speechiness > 0.3 },
  { name: 'Fear', imageSrc: '/moodify-music-app/fear.png', filter: (song: MusicData) => song.valence < 0.5 && song.energy > 0.5 && song.speechiness > 0.2 && song.tempo > 115 },
  { name: 'Disgust', imageSrc: '/moodify-music-app/disgust.png', filter: (song: MusicData) => song.valence < 0.4 && song.energy < 0.5 && song.acousticness > 0.5 && song.danceability < 0.4 },
];

export default function Home() {
  const [musicData, setMusicData] = useState<MusicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [filteredSongs, setFilteredSongs] = useState<MusicData[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const data = await loadMusicData();
        const uniqueSongsMap = new Map<string, MusicData>();
        for (const song of data) {
          const uniqueKey = `${song.track_id}-${song.track_name}-${song.artists}`.toLowerCase().trim();
          if (!uniqueSongsMap.has(uniqueKey)) {
            uniqueSongsMap.set(uniqueKey, song);
          }
        }
        setMusicData(Array.from(uniqueSongsMap.values()));
      } catch (err: unknown) {
        setError('Failed to load music data.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMood && musicData.length > 0) {
      const selectedMoodConfig = moodsConfig.find(mood => mood.name === selectedMood);
      if (selectedMoodConfig) {
        const moodSongs = musicData.filter(selectedMoodConfig.filter);
        setFilteredSongs(moodSongs.slice(0, INITIAL_LOAD_LIMIT));
      } else {
        setFilteredSongs(musicData.slice(0, INITIAL_LOAD_LIMIT)); // Default if mood not found
      }
    } else {
      setFilteredSongs(musicData.slice(0, INITIAL_LOAD_LIMIT)); // Default for "All Moods" or initial load
    }
  }, [selectedMood, musicData]);

  const handleMoodChange = (moodName: string) => {
    setSelectedMood(moodName);
  };

  const songsToDisplay = selectedMood ? filteredSongs : musicData.slice(0, INITIAL_LOAD_LIMIT);

  return (
    <div className="bg-pink-100 text-purple-900 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-700 text-center sm:text-left">Moodify</h1>

        <div className="mb-6 flex items-center justify-center sm:justify-start space-x-4">
          {moodsConfig.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodChange(mood.name)}
              className={`rounded-full border-2 border-pink-400 p-2 focus:outline-none ${selectedMood === mood.name ? 'bg-pink-300' : 'bg-pink-100 hover:bg-pink-200'}`}
            >
              <Image src={mood.imageSrc} alt={mood.name} width={40} height={40} className="rounded-full" />
            </button>
          ))}
        </div>

        {loading && <p className="text-purple-400 text-center">Loading music data...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && !error && (
          <div className="overflow-x-auto rounded-md bg-pink-200 shadow-md">
            <table className="min-w-full divide-y divide-pink-300">
              <thead className="bg-pink-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Track</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Artist</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Spotify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-300">
                {songsToDisplay.map((track) => (
                  <tr key={track.track_id}>
                    <td className="px-4 py-3 whitespace-nowrap text-purple-700 text-sm">{track.track_name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-purple-700 text-sm">{track.artists}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`https://open.spotify.com/track/${track.track_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-500 flex items-center space-x-1 text-sm"
                      >
                        <Image src="/spotify-icon.svg" alt="Spotify" width={16} height={16} />
                        <span>Open</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}