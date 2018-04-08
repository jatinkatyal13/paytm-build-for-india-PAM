from django.conf.urls import url
from . import views

urlpatterns = [
	url(r'^basic/?$', views.basic, name='basic'),
	url(r'^sessionId/(?P<id>[0-9]+)/?$', views.sessionId, name='sessionId'),
	url(r'^session/?$', views.session, name='session'),
    url(r'^patients/?$', views.patients, name='patients'),
    url(r'^textAnalyze/?$', views.textAnalyze, name='textAnalyze'),
    url(r'^imageAnalyze/?$', views.imageAnalyze, name='imageAnalyze'),
]
