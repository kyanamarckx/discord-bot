# Weather API
## General Information
- API bevat data over het weer
- Locatie kan meegegeven worden door een variabele
- Makkelijkst te gebruiken qua zichtbaarheid met csv, maar kan ook met JSON (voordeel hiervan is dat er meerde opties tegelijk mogelijk zijn, maar men kan die keuze ook aan de user laten en dat via een csv nog steeds laten uitlezen)
- User heeft sowieso standaard keuze uit een forecast van de komende 15 dagen in:
  1. dagen uitgedrukt
  2. uren uitgedrukt (elk uur nieuwe lijn)
- Er is ook de mogelijkheid om data te verkrijgen van het weer op deze moment alleen
  1. er is ook keuze voor een forecast van de komende 7 dagen of komende 24u, ipv 15 dagen (link aanpassen)

## Ideas
- Leuk idee kan zijn om ook, wanneer gewenst, een melding te sturen ivm de UV-index zoals hoge UV-index: goed om te zonnen maar genoeg insmeren, ...
- Melding sturen bij sunrise en sunset

## Data to use
Uit de csv:
- name (omzetten naar enkel stad/dorp of ervoor zorgen dat trema's goed getoond worden)
- datetime (omzetten voor de leesbaarheid van de user)
- tempmin
- temp
- feelslikemax
- feelslikemin
- feelslike
- humidity
- windspeed
- winddir (omzetten van getallen naar windrichting in woorden, zie afbeelding "wind direction degrees" voor uitleg)
- ?? sealevelpressure ??
- uvindex
- sunrise
- sunset
- ?? moonphase ?? (wordt al gebruikt in ander deel: "moonphase")
- description
