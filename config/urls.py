from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('maker.urls')),
    path('', include('authentication.urls')),
    path('', include('characterMaker.urls')),
    path('', include('combatClass.urls'))
]
