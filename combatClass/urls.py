from django.urls import path
from combatClass.views import displayClass

urlpatterns = [
    path('class', displayClass, name='classes')
]