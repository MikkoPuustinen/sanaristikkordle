import pandas as pd

#data = pd.read_csv("./sanalista.csv", sep="\s+")
with open("./words/newlist.csv", "a") as fw:

    with open("./words/wordlist.csv", "r") as f:
        #print(f.readlines())
        for line in f.readlines():
            newl = line.replace("\t", ",")
            print(newl)
            fw.write(newl)

#print(data)
