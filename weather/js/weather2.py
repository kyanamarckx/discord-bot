
import requests
import sys

import csv
import codecs
        

response = requests.request("GET", "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Belgium%2C%20Lierde?unitGroup=metric&include=days&key=QPC4KTE9Q544W9S65UMYUN9R8&contentType=csv")
if response.status_code!=200:
  print('Unexpected Status code: ', response.status_code)
  sys.exit()  


# Parse the results as CSV
CSVText = csv.reader(response.text.splitlines(), delimiter=',',quotechar='"')
        
# save the results to a file
with codecs.open('C:\Users\kyana\OneDrive - Hogeschool Gent\Documenten\GitHub\weather\weather\data\weather2.csv', 'w', encoding='utf8') as outfile:
    csvWriter = csv.writer(outfile, delimiter=',',quotechar='"')
    for row in CSVText:
        csvWriter.writerow(row)
