import json
import numpy as np
import os
from collections import Counter,defaultdict
import requests

from sklearn import cluster
from sklearn import metrics
import tensorflow as tf
    
def read_json(path,f):
    json_data = []
    cur_path = os.path.join(path,f)
    with open(cur_path) as json_file:
        for line in json_file:
            json_data.append(json.loads(line))
    return json_data
def read_all_json(folder_path):
    all_data = []
    print("Loading data....")
    counter = 0
    for folder in os.listdir(folder_path):
        cur_path = os.path.join(folder_path, folder)
        print("Loading %s"%(cur_path))
        if os.path.isdir(cur_path):
            for f in os.listdir(os.path.join(folder_path, folder)):
                if f.endswith(".json"):
                    with open(os.path.join(cur_path,f)) as json_file:
                        for line in json_file:
                            jd = json.loads(line)
                            all_data = all_data+jd
                            counter += len(jd)
                            print("this file's length:",len(jd))
    print("total query num:",counter)
    return [all_data]
def save_json(path,data):
    with open(path, 'w') as f:
        json.dump(data, f)

def process_data(json_data):
    tmp = defaultdict(lambda: defaultdict(int))
    counter = 0 
    for session in json_data[0]:
        events = session["events"]
        last_vrex_search=-1
        tune = -1
        for idx,event in enumerate(events):
            if event["eventType"] == "vrexSearch":
                last_vrex_search = idx
        if last_vrex_search >=0:
            for idx in range(last_vrex_search,len(events)):
                event = events[idx]
                if event["eventType"] == "mediaTuneMetrics":
                    tune = idx
                    break
        if last_vrex_search >=0 and tune >= 0:
            query = events[last_vrex_search]["term"]
            to = events[tune]["title"]
            tmp[query][to] += 1
            counter += 1
    print("unique queries:",len(tmp))
    print("total queries:",counter)
    return tmp

def splitby_actionTypes(x):
    results = {"series":[],"channels":[],"choose":[]}
    failed_names = []
    for each in x:
        query = each
        print(query)
        try:
            r = requests.post("http://vrexapp-wc-01p.sys.comcast.net:8080/vsp/v1/speech?appId=xr11v2-789ec072-d47e-4eac-9b5d-5f8f7a46e143&vrexFilters=EVENT,NLP,AR&codec=PCM_16_16K&language=eng&receiverId=P0113659092&debug=true&vrexFields=fnlp,trx,cid,message,code,speech,transcription&activateFeature=test", data=query)
            json_data = r.json()
            result = json_data["fnlp"]["nlpResponses"][0]["response"]["jsonResponse"]["response"][0]["action"]
            if result == "CHANNEL_NAME":
                results["channels"].append(x[each])
            elif result == "SERIES":
                results["series"].append(x[each])
            elif result == "CHOOSE":
                results["choose"].append(x[each])
        except:
            failed_names.append(query)
    save_json("saved/07_30_divid_by_type_3types.json",results)
    print(failed_names)
    return results

def cluster_by_USE(query2program):
    import tensorflow_hub as hub
    from sklearn import cluster
    from sklearn import metrics
    from sklearn.neighbors import NearestNeighbors

    # Define the graph
    tf.logging.set_verbosity(tf.logging.ERROR)
    embed = hub.Module("https://tfhub.dev/google/universal-sentence-encoder/2")
    sentences = tf.placeholder(dtype=tf.string, shape=[None])
    embedding_fun = embed(sentences)

    # Get the data
    queries = [k for k in query2program]

    with tf.Session() as sess:
        sess.run([tf.global_variables_initializer(), tf.tables_initializer()])
        context_embed = sess.run(embedding_fun, feed_dict={sentences: queries})
    print(context_embed.shape)

    # NN 
    nbrs = NearestNeighbors(n_neighbors=2, algorithm='ball_tree').fit(context_embed)
    print("Done fitting Nearest Neighbor")
    # Cluster by Kmeans 
    NUM_CLUSTERS = 100
    kmeans = cluster.KMeans(n_clusters=NUM_CLUSTERS)
    kmeans.fit(context_embed)
    print("Done fitting K Means Cluster")
    
    labels = kmeans.labels_
    centroids = kmeans.cluster_centers_
    print(centroids.shape)
    cluster_data ={}

    for cur_label in range(NUM_CLUSTERS):
        indexes = np.where(labels==cur_label)
        cluster = np.array(queries)[indexes]
        center = centroids[cur_label]
        repr_q = nbrs.kneighbors(center.reshape(1,-1))
        repr_q = repr_q[1][0][0]
        repr_q = queries[repr_q]
        cluster_data[repr_q] = {}
        
        for p in cluster:
            cluster_data[repr_q][p] = query2program[p]
    return cluster_data

