import requests
import sys

import json
                

response = requests.request("GET", "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Belgium%2C%20Lierde?unitGroup=metric&include=current%2Cdays%2Chours%2Calerts%2Cevents&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=json")
if response.status_code!=200:
  print('Unexpected Status code: ', response.status_code)
  sys.exit()  


# Parse the results as JSON
jsonData = response.json()

# save the results to a file
with open('C:\Users\kyana\OneDrive - Hogeschool Gent\Documenten\GitHub\weather\weather\data\weather.json', 'w') as outfile:
    json.dump(jsonData, outfile)
    
     