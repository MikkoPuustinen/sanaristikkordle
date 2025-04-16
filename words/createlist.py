import pandas as pd
import json
import pickle


data = pd.read_csv("./words/newlist.csv", encoding="utf-8")

with open('./words/wikipedia.pkl', 'rb') as f:
    wiki = pickle.load(f)

words = data['Hakusana']

validWords = []

for word in words:
    stripped = ''.join(e for e in word if e.isalnum())
    if len(stripped) == 4 or len(stripped) == 5 or len(stripped) == 3 or len(stripped) == 2:
        validWords.append(stripped.upper())

for word in wiki:
    validWords.append(word)

print(len(validWords))

json_data = json.dumps(validWords)

with open("./sanalista.json", "w") as f:
    f.write(json_data)

with open("./sanalist.txt", "w") as f:
    for word in validWords:
        f.write(word.upper() + " \n")