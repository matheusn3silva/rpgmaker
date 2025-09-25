from django.db import models

class createCharacterModel(models.Model):
    name = models.CharField(max_length=100, null=False, blank=False)
    age = models.IntegerField(null=False, blank=False)
    personality = models.CharField(max_length=100, null=False, blank=False)
    birth = models.DateField(null=False, blank=False)
    birthPlace = models.CharField(max_length=100, null=False, blank=False)
    house = models.CharField(max_length=100, null=False, blank=False)
    hobby = models.CharField(max_length=100, null=False, blank=True)
    landmarkItem = models.CharField(max_length=100, null=False, blank=True)
    motivation = models.CharField(max_length=100, null=False, blank=False)
    history = models.TextField(null=False)

    def __str__(self):
        return self.name
