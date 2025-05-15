from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=[('admin', 'Admin'), ('user', 'User')])

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Film(models.Model):
    title = models.CharField(max_length=100)
    duration = models.IntegerField()
    description = models.TextField()

class Hall(models.Model):
    name = models.CharField(max_length=100)

class Schedule(models.Model):
    film = models.ForeignKey(Film, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    showtime = models.DateTimeField()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance, role='user')
