from flask import Flask, request, jsonify
import pickle
from nltk.stem import WordNetLemmatizer
import re
import pandas as pd
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Loading the trained model and vectorizer
def load_models():
    with open('vectoriser-ngram(1,2).pickle', 'rb') as vectorizer_file:
        vectorizer = pickle.load(vectorizer_file)

    with open('Sentiment-LR.pickle', 'rb') as model_file:
        LRModel = pickle.load(model_file)

    return vectorizer, LRModel

vectorizer, LRModel = load_models()

# Data preprocessing
def preprocess(textdata):
    processedText = []

    # Create Lemmatizer.
    wordLemm = WordNetLemmatizer()

    # Defining regex patterns.
    urlPattern = r"((http://)[^ ]*|(https://)[^ ]*|( www\.)[^ ]*)"
    userPattern = '@[^\s]+'
    alphaPattern = "[^a-zA-Z0-9]"
    sequencePattern = r"(.)\1\1+"
    seqReplacePattern = r"\1\1"

    for tweet in textdata:
        tweet = tweet.lower()

        # Replace all URLs with 'URL'
        tweet = re.sub(urlPattern, ' URL', tweet)
        # Replace @USERNAME to 'USER'.
        tweet = re.sub(userPattern, ' USER', tweet)
        # Replace all non-alphabets.
        tweet = re.sub(alphaPattern, " ", tweet)
        # Replace 3 or more consecutive letters by 2 letters.
        tweet = re.sub(sequencePattern, seqReplacePattern, tweet)

        tweetwords = ''
        for word in tweet.split():
            if len(word) > 1:
                # Lemmatizing the word.
                word = wordLemm.lemmatize(word)
                tweetwords += (word + ' ')

        processedText.append(tweetwords)

    return processedText


@app.route('/predict', methods=['POST'])
@cross_origin(origin='*')
def predict():
    try:
        data = request.get_json()
        reviews = data.get('reviews', [])

        # Preprocess the data
        processed_reviews = preprocess(reviews)

        # Vectorize the processed data
        textdata = vectorizer.transform(processed_reviews)

        # Make predictions using the loaded model
        predictions = LRModel.predict(textdata)

        # Convert the predictions to human-readable labels
        sentiment_labels = ["Positive" if pred == 1 else "Negative" for pred in predictions]

        return jsonify({'predictions': sentiment_labels})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
