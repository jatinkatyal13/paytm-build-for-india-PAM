from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^patients/?', views.patients, name='patients'),
    url(r'^textAnalyze/?', views.textAnalyze, name='textAnalyze'),
]
