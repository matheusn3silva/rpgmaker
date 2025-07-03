from django.shortcuts import render

def displayClass(request):
    return render(request, 'combat-class/display-class.html')
