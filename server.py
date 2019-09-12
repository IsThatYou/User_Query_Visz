#!/usr/bin/env python

import os
from flask import Flask, request, Response, jsonify, send_file, send_from_directory,render_template
from process_data import read_json,process_data,splitby_actionTypes,read_all_json,cluster_by_USE
import requests
app = Flask(__name__)


@app.route("/")
def index():
    return render_template('index.html')

@app.route("/get_data/",methods=['POST', 'OPTIONS'])
def get_data():
    print("AA")
    print(request.get_json())
    print(len(query2program))
    return jsonify({"result":query2program,"clusters":clusters})

@app.route("/get_action/",methods=['POST', 'OPTIONS'])
def get_action():
    print("BB")
    query = request.get_json()
    print("in backend:",query)
    r = requests.post("http://vrexapp-wc-01p.sys.comcast.net:8080/vsp/v1/speech?appId=xr11v2-789ec072-d47e-4eac-9b5d-5f8f7a46e143&vrexFilters=EVENT,NLP,AR&codec=PCM_16_16K&language=eng&receiverId=P0113659092&debug=true&vrexFields=fnlp,trx,cid,message,code,speech,transcription&activateFeature=test", data=query)
    return jsonify({"result":r.json()})

if __name__ == "__main__":
    # FOLDER_PATH = "hailong_data/07_30"
    # FILE_NAME = "session-vrex-tune-2019-07-30-13.json"
    FOLDER_PATH = "hailong_data/"
    
    json_data = read_all_json(FOLDER_PATH)

    # json_data = read_json(FOLDER_PATH,FILE_NAME)
    query2program = process_data(json_data)
    del json_data
    clusters = cluster_by_USE(query2program)
    print("finished data processing")
    # print(clusters.keys)


    # query2program2 = splitby_actionTypes(query2program)

    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000), debug=True)
