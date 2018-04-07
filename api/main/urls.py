from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^patients/?', views.patients, name='patients'),		
]
