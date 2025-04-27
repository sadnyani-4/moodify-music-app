import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def preprocess_data(csv_file_path):
    """
    Loads, cleans, and preprocesses the song data from a CSV file.

    Args:
        csv_file_path (str): The path to the CSV file.

    Returns:
        tuple: A tuple containing the training and testing sets (X_train, X_test).
               Returns None if an error occurs during processing.
    """
    try:
        # 1. Load the CSV file into a Pandas DataFrame
        df = pd.read_csv(csv_file_path)
        print(f"Loaded data from {csv_file_path} successfully.")

        # 2. Clean the data
        #   - Handle missing values (replace with the mean for numerical columns, 'Unknown' for strings)
        for col in df.columns:
            if df[col].dtype in ['int64', 'float64']:
                df[col] = df[col].fillna(df[col].mean())
            elif df[col].dtype == 'object':
                df[col] = df[col].fillna('Unknown')
        print("Missing values handled.")

        # 3. Feature Selection (Start with audio features, add track_genre, and keep track_id, artists, track_name)
        #   - Select relevant features.  We'll start with audio features and track_genre
        features = [
            'track_id', 'artists', 'track_name', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
            'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo',
            'time_signature', 'track_genre'
        ]
        df = df[features]  # Keep selected columns
        print("Features selected.")

        # 4. Handle Categorical Variable: track_genre using one-hot encoding
        df = pd.get_dummies(df, columns=['track_genre'], prefix='genre')
        print("Categorical variable 'track_genre' encoded.")

        # 5. Prepare data for scaling and splitting.
        X = df.drop(columns=[])  # All remaining columns are features
        # There is no y, so  we should not create it.
        # 6. Split the data into training and testing sets (80% train, 20% test)
        X_train, X_test = train_test_split(df, test_size=0.2, random_state=42) # Changed to only return X_train, X_test

        # 7. Scale the numerical features using StandardScaler
        scaler = StandardScaler()
        numerical_cols = X_train.select_dtypes(include=['int64', 'float64']).columns
        X_train[numerical_cols] = scaler.fit_transform(X_train[numerical_cols])
        X_test[numerical_cols] = scaler.transform(X_test[numerical_cols])  # Use the same scaler
        print("Data scaled and split.")

        return X_train, X_test

    except FileNotFoundError:
        print(f"Error: File not found at {csv_file_path}")
        return None
    except Exception as e:
        print(f"An error occurred during data preprocessing: {e}")
        return None

if __name__ == "__main__":
    # Specify the path to your CSV file
    csv_file_path = '../mood-based-music-recommender/public/unique_songs.csv'  # Replace with the actual path to your CSV file

    # Preprocess the data
    X_train, X_test = preprocess_data(csv_file_path)

    # Check if preprocessing was successful
    if X_train is not None and X_test is not None:
        print("Data preprocessing complete.  Here's a sample of the processed training data:")
        print(X_train.head())
        print("Shape of X_train:", X_train.shape)
        print("Shape of X_test:", X_test.shape)
    else:
        print("Data preprocessing failed.")
