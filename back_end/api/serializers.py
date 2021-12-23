from django.db.models import fields
from rest_framework import serializers

from .models import User, Movie, MovieLink


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True)

class MovieSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'name', 'genre', 'episodes')

class MovieLinkSerializer(serializers.HyperlinkedModelSerializer):
    movie = MovieSerializer(read_only=True)
    class Meta:
        model = MovieLink
        fields = ('id', 'movie', 'link', 'episode')

class UserRatingSerializer(serializers.Serializer):
    movieid = serializers.IntegerField(required=True)
    rating = serializers.FloatField(required=True)

class UserGetRatingSerializer(serializers.Serializer):
    movieid = serializers.IntegerField(required=True)