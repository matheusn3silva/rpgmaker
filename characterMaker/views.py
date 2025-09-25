from django.shortcuts import render, redirect
from .models import createCharacterModel

def displayCharacters(request):

    characters = createCharacterModel.objects.all()

    return render(request, 'character/display-characters.html', { "characters": characters })

def createCharacter(request):

    if request.method == "POST":
        name = request.POST.get("name-character")
        age = request.POST.get("age-character")
        personality = request.POST.get("personality-character")
        birth = request.POST.get("birth-date-character")
        birthPlace = request.POST.get("birth-place-character")
        house = request.POST.get("live-local-character")
        hobby = request.POST.get("hobby-character")
        landmarkItem = request.POST.get("landmark-item-character")
        motivation = request.POST.get("motivation-character")
        history = request.POST.get("history-character")

        character = createCharacterModel.objects.create(
            name=name,
            age=age,
            personality=personality,
            birth=birth,
            birthPlace=birthPlace,
            house=house,
            hobby=hobby,
            landmarkItem=landmarkItem,
            motivation=motivation,
            history=history
        )

        character.save()

        return redirect('characters')

    return render(request, 'character/create-character.html')