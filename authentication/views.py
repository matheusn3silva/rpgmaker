from django.shortcuts import render, redirect

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from authentication.models import User
from authentication.serializers import UserSerializer

# Create your views here.
def login(request):
    return render(request, 'authentication/login.html')

def register(request):
    return render(request, 'authentication/register.html')


@api_view(['POST'])
def createUser(request):
    
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        
        serializer.save()

        return redirect('login')

    
    return redirect('register')