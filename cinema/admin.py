from django.contrib import admin
from .models import Film, Hall, Schedule

@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ('title', 'duration')

@admin.register(Hall)
class HallAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity')

@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('film', 'hall', 'start_time', 'end_time')
    list_filter = ('hall', 'start_time')
    search_fields = ('film__title', 'hall__name')