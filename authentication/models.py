from django.db import models

class User(models.Model):
    user = models.CharField(primary_key=True, max_length=100, null=False, blank=False)
    password = models.CharField(max_length=100, null=False, blank=False)
    # email = models.EmailField(primary_key=True ,null=False, blank=False)

    def __str__(self):
        return f'Usuário: {self.user}'
    
