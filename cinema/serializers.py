from rest_framework import serializers
from .models import Film, Hall, Schedule

class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = '__all__'

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    end_time = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = ['id', 'film', 'hall', 'start_time', 'end_time']

    def get_end_time(self, obj):
        return obj.end_time()