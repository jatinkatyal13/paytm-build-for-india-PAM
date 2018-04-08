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
from .analysis.ai import *

from collections import OrderedDict

import json

# Create your views here.

c, st, labels, senten = create_frame(Data)
sen = c[3]
emo = c[0]
Data = create_data(sen, emo)
word_features = get_word_features(get_words_in_dataset(Data))

@csrf_exempt
def basic(request):
	d = OrderedDict()
	d['number_of_patients'] = Patient.objects.all().count()
	d['number_of_sessions'] = Session.objects.all().count()

	return JsonResponse(d, safe=False)

@csrf_exempt
def sessionId(request, id):
	s = Session.objects.filter(patient = Patient.objects.get(pk = id))
	ser = SessionSerializer(s, many=True)
	return JsonResponse(ser.data, safe=False)

@csrf_exempt
def session(request):
	if request.method == 'POST':
		try:
			req = json.loads(request.body.decode('utf-8'))
			s = Session.objects.create(
				patient = Patient.objects.get(pk = int(req['patient_id'])),
				textual_emotional = json.dumps(req['textual_emotional']),
				textual_sentimental = json.dumps(req['textual_sentiment']),
				facial_emotional = json.dumps(req['facial_emotional']),
				textual_conversation = json.dumps(req['messages'])
			)
			ser = SessionSerializer(s, many=True)
			return JsonResponse(ser.data, safe=False)
		except Exception as e:
			d = OrderedDict()
			d['error'] = str(e)
			return JsonResponse(d, safe=False)
	else:
		sessions = Session.objects.all()
		ser = SessionSerializer(sessions, many=True)
		return JsonResponse(ser.data, safe=False)

@csrf_exempt
def patients(request):
	if request.method == 'POST':
		try:
			name = request.POST['name']
			patient = Patient.objects.create(name = name)
			ser = PatientSerializer(patient)
			return JsonResponse(ser.data, safe=False)
		except Exception as e:
			d = OrderedDict()
			d['error'] = str(e)
			return JsonResponse(d, safe=False)
	else:
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
			res['response'] = apiai_response(s)
		except Exception as e:
			print(e)
			res['error'] = "Emotion key not found"	
	else:
		res['error'] = "Method not supported"
	return JsonResponse(res, safe = False)
