from django.contrib import admin
from .models import Film, Hall, Schedule, UserProfile

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration']

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ['name']

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['film', 'hall', 'showtime']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role']
