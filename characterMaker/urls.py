from django.urls import path
from characterMaker.views import displayCharacters

urlpatterns = [
    path('characters/', displayCharacters, name='characters'),
]