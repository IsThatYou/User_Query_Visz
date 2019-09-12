import requests
import json
# query = "puppy puppy pals"
# r = requests.post("http://vrexapp-wc-01p.sys.comcast.net:8080/vsp/v1/speech?appId=xr11v2-789ec072-d47e-4eac-9b5d-5f8f7a46e143&vrexFilters=EVENT,NLP,AR&codec=PCM_16_16K&language=eng&receiverId=P0113659092&debug=true&vrexFields=fnlp,trx,cid,message,code,speech,transcription&activateFeature=test", data=query)
# json_data = r.json()
# print(json_data)
# print(json_data.keys())
# print(json_data["fnlp"]["nlpResponses"][0]["response"]["jsonResponse"]["response"][0]["action"])
json_data=[]
with open("saved/07_30_divid_by_type.json") as json_file:
    for line in json_file:
        json_data=json.loads(line)

print(len(json_data["channels"]))