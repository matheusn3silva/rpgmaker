from django.shortcuts import render

def displayCharacters(request):
    return render(request, 'character/display-characters.html')

def createCharacter(request):
    return render(request, 'character/create-character.html')