from django.db import models

# Create your models here.

class Patient(models.Model):
	name = models.CharField(max_length = 100)
	cont = models.BooleanField(default = True)
	class Meta:
		ordering = ('name',)
