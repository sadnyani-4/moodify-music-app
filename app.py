from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib  # For loading the model and vectorizer
from moodify_preprocessing import preprocess_data  # Assuming this is in the same directory
import random
from sklearn.feature_extraction.text import TfidfVectorizer
import numpy as np  # added import

app = Flask(__name__)
CORS(app)

# Global variables to hold the preprocessed data and model
X_train_global = None
X_test_global = None
emotion_model = None
tfidf_vectorizer = None
song_data_global = None  # To store the song data

# Load the preprocessed data
csv_file_path = './public/unique_smooongs.csv'


def load_data():
    """Loads and preprocesses the data, sets global variables."""
    global X_train_global, X_test_global, song_data_global
    try:
        X_train, X_test = preprocess_data(csv_file_path)
        if X_train is None or X_test is None:
            print("Error: Failed to load and preprocess data.")
            return False  # Indicate failure
        X_train_global = X_train
        X_test_global = X_test

        # Load the song data into a DataFrame.  Crucial for song retrieval.
        song_data_global = pd.read_csv(csv_file_path)
        song_data_global.dropna(inplace=True)  # remove null values
        return True
    except Exception as e:
        print(f"Error loading data: {e}")
        return False  # Indicate failure


# Load the emotion detection model and vectorizer
def load_model():
    """Loads the emotion detection model and TF-IDF vectorizer, sets global variables."""
    global emotion_model, tfidf_vectorizer
    try:
        model_path = 'emotion_model.joblib'  # Path to your saved model
        vectorizer_path = 'tfidf_vectorizer.joblib'  # Path to your saved vectorizer
        emotion_model = joblib.load(model_path)
        tfidf_vectorizer = joblib.load(vectorizer_path)
        print("Model and vectorizer loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model or vectorizer: {e}")
        return False  # Indicate failure


def map_mood_to_songs(song_data, emotion):
    """
    Manually maps song features to the 5 Inside Out emotions and selects songs
    from the given song data.

    Args:
        song_data (pd.DataFrame): DataFrame containing song data with audio features,
                                    including 'track_id', 'artists', and 'track_name'.
        emotion (str): The emotion to map to ('Joy', 'Sadness', 'Anger', 'Fear', 'Disgust').
                    Note: Capitalized emotion strings.

    Returns:
        pd.DataFrame: A DataFrame containing the songs that match the given emotion.
                        Returns an empty DataFrame if no songs match the emotion.
    """
    try:
        # 1. Define the manual mood mapping rules (these are initial guidelines, you can adjust)
        #   - Adjusted rules to be less restrictive
        if emotion == 'Joy':
            mapped_songs = song_data[(song_data['valence'] > 0.6) & (song_data['energy'] > 0.5)]  # Relaxed tempo
        elif emotion == 'Sadness':
            mapped_songs = song_data[(song_data['valence'] < 0.4) & (song_data['energy'] < 0.5)]  # Relaxed tempo and acousticness
        elif emotion == 'Anger':
            mapped_songs = song_data[(song_data['energy'] > 0.7) & (song_data['loudness'] > -7)]  # Relaxed loudness
        elif emotion == 'Fear':
            mapped_songs = song_data[(song_data['valence'] < 0.5) & (song_data['energy'] > 0.6)]  # Relaxed tempo and liveness
        elif emotion == 'Disgust':
            mapped_songs = song_data[(song_data['valence'] < 0.6) & (song_data['danceability'] < 0.5)]  # Relaxed energy and speechiness
        else:
            print(f"Error: Invalid emotion '{emotion}'.")
            return pd.DataFrame()  # Return an empty DataFrame for invalid emotion

        # 2. Print the number of songs found for the emotion.
        print(f"Found {len(mapped_songs)} songs for the emotion: {emotion}")
        return mapped_songs

    except Exception as e:
        print(f"An error occurred during mood mapping: {e}")
        return pd.DataFrame()  # Return an empty DataFrame in case of error



@app.route('/get_songs/<emotion>', methods=['GET'])
def get_songs(emotion):
    """
    API endpoint to get songs for a given emotion.

    Args:
        emotion (str): The emotion ('joy', 'sadness', 'anger', 'fear', 'disgust')

    Returns:
        JSON: A JSON response containing a list of songs (track_id, artists, track_name)
              for the given emotion.  Returns an error message if the emotion is invalid
              or if no songs are found.
    """
    global X_train_global, X_test_global, song_data_global
    try:
        emotion = emotion.capitalize()  # Normalize emotion string to capitalized.  CRUCIAL
        if emotion not in ['Joy', 'Sadness', 'Anger', 'Fear', 'Disgust']:  # Corrected emotion list
            return jsonify({'error': f'Invalid emotion: {emotion}'}), 400

        # Use the global song_data
        mapped_songs = map_mood_to_songs(song_data_global, emotion)

        if not mapped_songs.empty:
            # Randomly select up to 20 songs
            if len(mapped_songs) > 20:
                random_songs = mapped_songs.sample(n=20)
            else:
                random_songs = mapped_songs
            songs_list = random_songs[['track_id', 'artists', 'track_name']].to_dict(orient='records')
            return jsonify({'songs': songs_list}), 200
        else:
            return jsonify({'message': f'No songs found for emotion: {emotion}'}), 200

    except Exception as e:
        print(f"Error processing request: {e}")
        return jsonify({'error': f'Internal server error: {e}'}), 500



@app.route('/analyze_mood', methods=['POST'])
def analyze_mood():
    try:
        data = request.get_json()
        text = data['text']
        if not text:
            return jsonify({'error': 'No text provided'}), 400

        global emotion_model, tfidf_vectorizer
        if emotion_model is None or tfidf_vectorizer is None:
            return jsonify({'error': 'Emotion detection model or vectorizer failed to load'}), 500

        try:
            # 1. Vectorize the input text using the loaded TF-IDF vectorizer
            text_vectorized = tfidf_vectorizer.transform([text])  # [text] because it expects a list of documents

            # 2. Predict the emotion using the loaded model
            emotion_prediction = emotion_model.predict(text_vectorized)
            emotion = emotion_prediction[0].capitalize()  # Capitalize the emotion

            # 3.  predict_proba to get confidence.
            confidence_scores = emotion_model.predict_proba(text_vectorized)
            confidence = np.max(confidence_scores)  # get the highest probability

            print(f"Predicted Emotion: {emotion}, Confidence: {confidence}")
            return jsonify({'emotion': emotion, 'confidence': float(confidence)}), 200

        except Exception as e:
            print(f"Error during emotion analysis: {e}")
            return jsonify({'error': f'Internal server error: {e}'}), 500
    except Exception as e:
        print(f"Error analyzing mood: {e}")
        return jsonify({'error': f'Internal server error: {e}'}), 500


if __name__ == '__main__':
    # Load data and model before starting the app
    if not load_data():
        print("Failed to load data. Exiting.")
        exit(1)
    if not load_model():
        print("Failed to load model. Exiting.")
        exit(1)
    app.run(debug=True, port=5001)
