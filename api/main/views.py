from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser

from .models import *
from .serializers import *

# Create your views here.

def patients(request):
	pat = Patient.objects.all()
	ser = PatientSerializer(pat, many=True)
	return JsonResponse(ser.data, safe=False)

