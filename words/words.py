import pandas as pd

#data = pd.read_csv("./sanalista.csv", sep="\s+")
with open("./newlist.csv", "a") as fw:
    print("asdd")

    with open("./sanalista.csv", "r") as f:
        #print(f.readlines())
        for line in f.readlines():
            newl = line.replace("\t", ",")
            print(newl)
            fw.write(newl)

#print(data)
