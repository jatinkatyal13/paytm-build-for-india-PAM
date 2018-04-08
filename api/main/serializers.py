from rest_framework import serializers
from .models import *

class PatientSerializer(serializers.ModelSerializer):
	class Meta:
		model = Patient 
		fields = '__all__'

class SessionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Session
		fields = '__all__'
