from django.urls import path
from characterMaker.views import displayCharacters, createCharacter

urlpatterns = [
    path('characters/', displayCharacters, name='characters'),
    path('character/create', createCharacter, name='create')
]