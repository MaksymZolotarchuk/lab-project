from rest_framework import serializers
from .models import Film, Hall, Schedule, UserProfile
from django.contrib.auth.models import User

class FilmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Film
        fields = ['id', 'title', 'duration', 'description']

class HallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hall
        fields = ['id', 'name']

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'film', 'hall', 'showtime']

class UserSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='userprofile.role')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

class UserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('user', 'User')], default='user')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, role=role)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)