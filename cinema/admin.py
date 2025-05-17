# cinema/admin.py
from django.contrib import admin
from .models import Film, Hall, Schedule

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ['title', 'duration']
    list_filter = ['title']

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ['name', 'capacity']  # Використовуємо нове поле capacity
    list_filter = ['name']

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ['film', 'hall', 'showtime']  # Замінюємо start_time, end_time на showtime
    list_filter = ['film', 'showtime']