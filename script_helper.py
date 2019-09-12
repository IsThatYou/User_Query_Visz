from collections import defaultdict
import json
import numpy as np
import matplotlib.pyplot as plt
from collections import Counter
from fractions import Fraction
import math
    
def total(data):
    return sum([x[1] for x in data.items()])
def find_max(data,w):
    return max(data[w], key=lambda key:data[w][key])
def plot(data, key, title, tilt=20):
    data = Counter(dict(data[key]))
#     print(data)
    plot_freq(data,20,tilt,title)

def plot_freq(arr, key,top, tilt=20, m=""):
    # plot bar graph of top frequency data
    data = Counter(dict(arr[key]))
    data = data.most_common(top)
    
    x = np.arange(len(data))
    freq = [y[1] for y in data]
    label = [y[0] for y in data]
    plt.tight_layout
    plt.figure(figsize=(28,10))
    plt.bar(x,height = freq)
    plt.xticks(x, label,rotation=tilt) # no need to add .5 anymore
    plt.title(m,fontsize=35)
    plt.show()
    
def Clean_Data(data):
    # get rid of duplicate queires
    check_list = set()
    for each in range(len(data)):
        new_list = []
        for query in data[each]:
            if 'trx' in query:
                if query['trx'] not in check_list:
                    new_list.append(query)
                    check_list.add(query['trx'])
            else:
                new_list.append(query)
        data[each] = new_list
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
def compute_entropy(data, key, m, tilt,top = 20):
    data[key].pop("", None)
    if m!="":
        plot_freq(data,key,top,tilt,m)
    data = Counter(dict(data[key]))
    data = data.most_common(top)
    total_count = sum([x[1] for x in data])
#     print([math.log(Fraction(x[1],total_count))  for x in data])
    H = sum([Fraction(x[1],total_count) *math.log(Fraction(x[1],total_count))  for x in data]) * -1
#     print("Entrophy is %f" % (H))
    return H
    
def compute_l2(data, key, m, tilt,top = 20):
    
    if m!="":
        plot_freq(data,key,top,tilt,m)
    data = Counter(dict(data[key]))
    data = data.most_common(top)
    total_count = sum([x[1] for x in data])
    norm = Fraction(1,len(data))
#     print(total_count, norm)
    M = sum([(Fraction(x[1],total_count)-norm)**2 for x in data])
#     print("The l2 distance is %f"%(M))
    return M
def compute_KL_distance(data, key, m, tilt,top = 20):
    if m!="":
        plot_freq(data,key,top,tilt,m)
    data = Counter(dict(data[key]))
    top = len(data)
    data = data.most_common(top)
    total_count = sum([x[1] for x in data])
#     print([math.log(Fraction(x[1],total_count))  for x in data])
    Q = Fraction(1, top)
    D = sum([Fraction(x[1],total_count) *math.log(Fraction(Fraction(x[1],total_count), Q))  for x in data])
    print("Entrophy is %f" % (D))
    return D