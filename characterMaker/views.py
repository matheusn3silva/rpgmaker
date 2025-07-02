from django.shortcuts import render

def displayCharacters(request):
    return render(request, 'character/displayCharacters.html')
