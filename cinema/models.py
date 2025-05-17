# cinema/models.py
from django.db import models
from django.contrib.auth.models import User

class Film(models.Model):
    title = models.CharField(max_length=100)
    duration = models.IntegerField()
    description = models.TextField(blank=True)

    def __str__(self):
        return self.title

class Hall(models.Model):
    name = models.CharField(max_length=50)
    capacity = models.IntegerField(default=100)  # Додаємо поле capacity

    def __str__(self):
        return self.name

class Schedule(models.Model):
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    showtime = models.DateTimeField()  # Залишаємо showtime

    def __str__(self):
        return f"{self.film.title} at {self.hall.name}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=[('admin', 'Admin'), ('user', 'User')], default='user')

    def __str__(self):
        return f"{self.user.username} - {self.role}"