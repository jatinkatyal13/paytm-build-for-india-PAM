from django.db import models

# Create your models here.

class Patient(models.Model):
	name = models.CharField(max_length = 100)
	cont = models.BooleanField(default = True)
	class Meta:
		ordering = ('name',)

class Session(models.Model):
	patient = models.ForeignKey(Patient, on_delete = models.CASCADE)
	textual_emotional = models.CharField(max_length=1000)
	textual_sentimental = models.CharField(max_length=1000)
	facial_emotional = models.CharField(max_length=1000)
	textual_conversation = models.CharField(max_length=5000)
	date_time = models.DateTimeField(auto_now_add=True)