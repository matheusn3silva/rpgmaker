from django.urls import path
from authentication.views import login, register, createUser

urlpatterns = [
    path('login/', login, name='login'),
    path('register/', register, name='register'),
    path('create-user/', createUser, name='createUser')
]