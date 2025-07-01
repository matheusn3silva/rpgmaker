from django.shortcuts import render

def displayCharacters(request):
    return render(request, 'display_characters.html')
