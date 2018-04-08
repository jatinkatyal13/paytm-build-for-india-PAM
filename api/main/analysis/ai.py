import apiai
import json

ACCESS_TOKEN = '3171b8eb3a8b43f4a80b542c19bdb647'

ai = apiai.ApiAI(ACCESS_TOKEN)

def apiai_response(query):
	"""
	function to fetch api.ai response
	"""
	request = ai.text_request()
	request.lang='en'
	request.session_id=1
	request.query = query
	response = request.getresponse()
	return json.loads(response.read().decode('utf8'))['result']['fulfillment']['speech']
