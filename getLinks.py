import requests
import json

allLinks = set()
with open('a.json','r') as f:
	data = f.read()
        links = data.split("url\": \"")
        for i in links:
            if( i[:3] == "htt"):
               allLinks.add(i.split("\",")[0])
# filtering JS Links

jsLinks = list(filter(lambda x: x[-2:]== "js", allLinks))

for i in jsLinks:
    print i
    response = requests.get(i)
    fileName = i.split('/')[-1]
    print fileName
    while(not fileName[0].isalnum()):
        fileName = fileName[1:]
    with open(fileName,'w') as f:
        f.write(response.content)
