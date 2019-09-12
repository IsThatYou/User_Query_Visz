import json
import numpy as np
import matplotlib.pyplot as plt
from collections import Counter,defaultdict
from script_helper import plot,plot_freq,Clean_Data

### 1 ### access the file
#TODO: access the file directly in s3 (need aws access key & secret access key)
with open('data/part-00000.dms') as json_file:
    json_data = []
    for line in json_file:
        json_data.append(json.loads(line))
with open("data/2019-06-27.10_00_59_059.full.Program.json") as f:
    id_name_lookup = {}
    for line in f:
        info = json.loads(line)
        id_name_lookup[info["_id"]] = info
print("number of data points: ",len(json_data))

### 2 ### clean data and insert program names
Clean_Data(json_data)

count = 0
for i in range(len(json_data)):
    instance = json_data[i]
    n = len(instance)-1
    programid = instance[n]["programId"]
    if programid in id_name_lookup:
        count += 1
        json_data[i][n]["programName"] = id_name_lookup[programid]["_source"]["name"]
        # print(id_name_lookup[programid]["_source"]["name"])
    else:
        json_data[i][n]["programName"] = ""

def data_alloc(idx1,idx2):
    tmp = defaultdict(lambda: defaultdict(int))
    for i in range(len(dataset)):
        queries = dataset[i][idx1]
        to = dataset[i][idx2]
        if isinstance(queries,list):
            n = len(queries)-1
            queries = queries[n]
        if isinstance(to,list):
            to = to[0]
        n = len(queries)-1
        tmp[queries][to] +=1
    return tmp

### 3 ### explore the data

# list of tuples: [([queries], programId, programName) ... ] 
dataset = []
for i in range(len(json_data)):
    instance = json_data[i]
    n = len(instance)-1
    queries = []
    for j in range(n):
        queries.append(instance[j]["transcription"])
    companyname = instance[n]["companyName"]
    programname = instance[n]["programName"]
    dataset.append((queries, companyname, instance[n]["programId"],programname, instance[n]))

