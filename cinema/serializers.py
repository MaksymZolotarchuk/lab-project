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
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']

    def get_role(self, obj):
        try:
            role = obj.userprofile.role
            return role if role else 'user'
        except AttributeError:
            return 'user'

class UserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('user', 'User')], default='user')

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        role = validated_data.pop('role')
        user = User.objects.create_user(**validated_data)
        # Avoid duplicate UserProfile by checking existence
        profile, created = UserProfile.objects.get_or_create(user=user, defaults={'role': role})
        if not created:
            profile.role = role
            profile.save()
        return user

class UserUpdateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=[('admin', 'Admin'), ('user', 'User')], default='user')
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def update(self, instance, validated_data):
        role = validated_data.pop('role', instance.userprofile.role)
        password = validated_data.pop('password', None)

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if password:
            instance.set_password(password)
        instance.save()

        # Update existing UserProfile
        try:
            profile = instance.userprofile
            profile.role = role
            profile.save()
        except UserProfile.DoesNotExist:
            UserProfile.objects.create(user=instance, role=role)

        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
