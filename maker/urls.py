from django.urls import path
from maker.views import index

urlpatterns = [
    path('', index, name='index')
]