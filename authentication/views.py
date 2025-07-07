from django.shortcuts import render, redirect

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User
from authentication.serializers import UserSerizalizer

# Create your views here.
def login(request):
    return render(request, 'authentication/login.html')

def register(request):
    return render(request, 'authentication/register.html')


@api_view(['POST'])
def createUser(request):
    if request.method == "POST":
        user = request.POST.get('user')
        password = request.POST.get('password')
        confirmPassword = request.POST.get('confirm-password')

        print(user, password, confirmPassword)

        return redirect('login')
    else:
        return redirect('register')