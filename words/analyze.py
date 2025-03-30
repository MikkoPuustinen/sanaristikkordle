import pandas as pd
import json


data = pd.read_csv("./newlist.csv", encoding="utf-8")


words = data['Hakusana']

validWords = []

for word in words:
    stripped = ''.join(e for e in word if e.isalnum())
    if len(stripped) == 4 or len(stripped) == 5 or len(stripped) == 3:
        validWords.append(stripped.upper())


print(len(validWords))

json_data = json.dumps(validWords)

with open("sanalista.json", "w") as f:
    f.write(json_data)

with open("./sanalist.txt", "w") as f:
    for word in validWords:
        f.write(word.upper() + " \n")