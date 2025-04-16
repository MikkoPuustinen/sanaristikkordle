from datasets import load_dataset
import re
import pickle

regex = re.compile('[^a-zA-ZäöÄÖ]')

ds = load_dataset("wikimedia/wikipedia", "20231101.fi")


wordleWords = []

length = len(ds['train']) + 1
idx = 1

for entry in ds["train"]:
    print("Processing: ", idx, " / ", length, end="\r")
    words = entry['text'].split()

    for word in words:
        cleanWord = regex.sub('', word);

        if len(cleanWord) <= 5 and len(cleanWord) >= 2:
            wordleWords.append(cleanWord.upper());

    idx = idx + 1


wordleWords = list(set(wordleWords))

print("\nFound words", len(wordleWords))

with open("./words/wikipedia.pkl", 'wb') as f:
    pickle.dump(wordleWords, f);
