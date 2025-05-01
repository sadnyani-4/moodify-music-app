'use client';

import React, { useState, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingOrbs from '@/components/FloatingOrbs';

interface Song {
    track_id: string;
    artists: string;
    track_name: string;
}

interface MoodConfig {
    name: string;
    imageSrc: string;
    color: string;
}

const MoodMusicApp = () => {
    const [moodText, setMoodText] = useState('');
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMood, setSelectedMood] = useState<string | null>(null);

    const moodsConfig: MoodConfig[] = [
        { name: 'Joy', imageSrc: '/moodify-music-app/joy.png', color: '#FDEB4C' },
        { name: 'Sadness', imageSrc: '/moodify-music-app/sadness.png', color: '#446EB6' },
        { name: 'Anger', imageSrc: '/moodify-music-app/anger.png', color: '#F2A953' },
        { name: 'Fear', imageSrc: '/moodify-music-app/fear.png', color: '#9C6ADE' },
        { name: 'Disgust', imageSrc: '/moodify-music-app/disgust.png', color: '#2ecc71' },
    ];

    //Inside Out Color Palette
    const joyColor = '#FDEB4C';         // Yellow
    const angerColor = '#F2A953';         // Orange-Red
    const sadnessColor = '#446EB6';       // Blue
    const fearColor = '#9C6ADE';         // Purple
    const disgustColor = '#2ecc71';       // Green
    const busSeats = '#2C3E50';
    const longTermMemory = '#D3D3D3';

    const emotionColors = {
        Joy: joyColor,
        Sadness: sadnessColor,
        Anger: angerColor,
        Fear: fearColor,
        Disgust: disgustColor,
    };

    const fetchSongs = useCallback(async () => {
        if (!moodText.trim()) {
            setError('Please enter a description of your mood.');
            return;
        }

        setLoading(true);
        setError(null);
        setSongs([]);
        setSelectedMood(null); // Reset selected mood

        try {
            // Send text to Flask for emotion analysis
            const moodResponse = await fetch('http://127.0.0.1:5001/analyze_mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: moodText }),
            });

            if (!moodResponse.ok) {
                throw new Error(`Failed to analyze mood: ${moodResponse.status} ${moodResponse.statusText}`);
            }

            const moodData = await moodResponse.json();
            const emotion = moodData.emotion;
            console.log("Fetching songs for emotion:", emotion);

            // Check if the emotion is one of the 5 allowed emotions (CAPITALIZED)
            if (['Joy', 'Sadness', 'Anger', 'Fear', 'Disgust'].includes(emotion)) {
                setSelectedMood(emotion);
                // Fetch songs from Flask based on the detected emotion
                const songsResponse = await fetch(`http://127.0.0.1:5001/get_songs/${emotion}`);
                if (!songsResponse.ok) {
                    throw new Error(`Failed to fetch songs: ${songsResponse.status} ${songsResponse.statusText}`);
                }
                const songsData = await songsResponse.json();

                if (songsData.error) {
                    setError(songsData.error);
                } else if (songsData.message) {
                    setError(songsData.message);
                }
                else if (songsData.songs && songsData.songs.length > 0) {
                    setSongs(songsData.songs);
                } else {
                    setError('No songs found for the given mood. Please try a different description.');
                }
            }
            else {
                setError("Sorry, we can only process Joy, Sadness, Anger, Fear, and Disgust.  Please try again.")
            }

        } catch (err) { // Changed from err: any to err
            if (err instanceof Error) {
                setError(err.message || 'An unexpected error occurred.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }, [moodText]);

    return (
        <div
            className="min-h-screen p-4 sm:p-8 relative overflow-hidden"
            style={{
                backgroundColor: busSeats,
                color: '#FFFFFF'
            }}
        >
            {/* Floating Orbs Component */}
            <FloatingOrbs
                joyColor={joyColor}
                sadnessColor={sadnessColor}
                angerColor={angerColor}
                fearColor={fearColor}
                disgustColor={disgustColor}
                longTermMemoryColor={longTermMemory}
                numberOfOrbs={80}
            />

            <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6"
                    style={{
                        color: joyColor, // Joy - Yellow
                        textShadow: '0 0 15px rgba(255, 223, 0, 0.7)', // Add a glow effect
                    }}
                >
                    Moodify
                </h1>

                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-6"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Stronger shadow
                    }}
                >
                    <h2 className="text-lg sm:text-xl mb-2" style={{ color: longTermMemory }}>Describe your mood</h2>
                    <p className="text-gray-300 mb-4" style={{ color: longTermMemory }}>
                        Enter a few sentences about how you are feeling.
                    </p>
                    <textarea
                        placeholder="I'm feeling..."
                        value={moodText}
                        onChange={(e) => setMoodText(e.target.value)}
                        className={`bg-black/20 text-white border min-h-[120px] sm:min-h-[140px] w-full rounded-md p-4 placeholder:text-gray-400
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300
                                    ${selectedMood ? `border-${selectedMood.toLowerCase()}-500` : 'border-gray-700'}`} // Dynamic border color
                        disabled={loading}
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            color: '#FFFFFF',
                            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}

                    />
                    <button
                        onClick={fetchSongs}
                        className={
                            loading
                                ? "mt-4 w-full text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 cursor-not-allowed"
                                : "mt-4 w-full text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 \
                                    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" // Added hover and focus
                        }
                        disabled={loading}
                        style={{
                            backgroundColor: loading ? 'rgba(59, 130, 246, 0.7)' : '#3B82F6',
                            color: '#FFFFFF',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
                        }}
                    >
                        {loading ? 'Loading...' : 'Get Recommendations'}
                    </button>
                </div>

                {error && (
                    <div
                        className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-md p-4 flex items-start gap-2"
                        style={{
                            backgroundColor: 'rgba(220, 38, 38, 0.1)',
                            color: '#F87171',
                            borderColor: 'rgba(220, 38, 38, 0.2)',
                        }}
                    >
                        <AlertCircle className="h-4 w-4 mt-1" style={{ color: angerColor }} />
                        <div>
                            <h2 className="font-semibold" style={{ color: angerColor }}>Error</h2>
                            <p style={{ color: longTermMemory }}>{error}</p>
                        </div>
                    </div>
                )}

                {songs.length > 0 && selectedMood && (
                    <motion.div
                        className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', // Stronger shadow
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                        {moodsConfig.find(mood => mood.name === selectedMood)?.imageSrc && (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
        transition={{
            duration: 0.5,
            ease: 'easeInOut',
            repeatType: 'loop',
        }}
    >
        <Image
            src={moodsConfig.find(mood => mood.name === selectedMood)!.imageSrc}
            alt={selectedMood}
            width={60} // Reduced width
            height={60} // Reduced height
            className="rounded-full"
            // style={{ width: 'auto', height: 'auto' }} // Added style to address image warning
        />
    </motion.div>
)}
                            <span
                                className="text-2xl font-semibold" // Make the mood text more prominent
                                style={{
                                    color: moodsConfig.find(mood => mood.name === selectedMood)?.color,
                                    textShadow: `0 0 10px ${moodsConfig.find(mood => mood.name === selectedMood)?.color}`, // Stronger glow
                                }}
                            >
                                {selectedMood}'s Recommendations
                            </span>
                        </div>
                        <p className="text-gray-300 mb-4" style={{ color: longTermMemory }}>
                            Here are some songs that might resonate with how you're feeling:
                        </p>
                        <div className="space-y-4">
                            {songs.map((song, index) => {
                                const moodColor = selectedMood ? moodsConfig.find(m => m.name === selectedMood)?.color || '#FFFFFF' : '#FFFFFF';
                                return (
                                    <motion.div
                                        key={song.track_id}
                                        className="p-4 bg-black/20 rounded-md border border-gray-700 text-white flex justify-between items-center
                                                                        transition-all duration-300 hover:scale-[1.02] hover:shadow-lg" // Added hover effects
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }} // Staggered appearance
                                        style={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                            color: '#FFFFFF',
                                            borderColor: '#4B5563',
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-lg" style={{
                                                color: moodColor,
                                                textShadow: `0 0 5px ${moodColor}`, // Subtle glow for song title
                                            }}>{song.track_name}</h3>
                                            <p className="text-gray-400" style={{ color: longTermMemory }}>
                                                by {song.artists}
                                            </p>
                                        </div>
                                        <a
                                            href={`https://open.spotify.com/track/$$${song.track_id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-400 hover:text-green-300 transition-colors duration-200"

                                        >
                                            <Image
                                                src="/spotify-icon.svg" // Make sure this path is correct for your custom or default icon
                                                alt="Spotify"
                                                width={20}
                                                height={20}
                                            />
                                        </a>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default MoodMusicApp;