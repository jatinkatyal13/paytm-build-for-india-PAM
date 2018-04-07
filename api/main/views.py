from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from .models import *
from .serializers import *
from .analysis.ML import *
from .analysis.sentiment import *
from .analysis.face_analysis import *

from collections import OrderedDict

# Create your views here.

c, st, labels, senten = create_frame(Data)
sen = c[3]
emo = c[0]
Data = create_data(sen, emo)
word_features = get_word_features(get_words_in_dataset(Data))

def patients(request):
	pat = Patient.objects.all()
	ser = PatientSerializer(pat, many=True)
	return JsonResponse(ser.data, safe=False)

@csrf_exempt
def imageAnalyze(request):
	res = OrderedDict()
	if request.method == 'POST':
		try:
			b = request.POST['base64']
			res['emotion'] = predict_face(b)
		except:
			res['error'] = "Emotion key not found"	
	else:
		res['error'] = "Method not supported"
	return JsonResponse(res, safe = False)

@csrf_exempt
def textAnalyze(request):
	res = OrderedDict()
	if request.method == 'POST':
		try:
			s = request.POST['str']
			res['emotion'] = classify_dataset(s, word_features)
			res['sentiment'] = classify_sentiment(s)
		except Exception as e:
			print(e)
			res['error'] = "Emotion key not found"	
	else:
		res['error'] = "Method not supported"
	return JsonResponse(res, safe = False)
