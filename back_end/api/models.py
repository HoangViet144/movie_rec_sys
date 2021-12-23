from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.base import Model

from .managers import CustomUserManager

# Create your models here.
class User(AbstractUser):
  username = None
  last_login = None
  date_joined = None
  email = models.EmailField(max_length=255, unique=True)

  USERNAME_FIELD = 'email'
  REQUIRED_FIELDS = []

  objects = CustomUserManager()

  def __str__(self) -> str:
    return self.email

class Movie(models.Model):
    name = models.CharField(max_length=500)
    genre = models.CharField(max_length=500)
    episodes = models.CharField(max_length=500)
    image = models.CharField(max_length=1000, default='')

    def __str__(self) -> str:
        return "%s %s %s" % (self.name, self.genre, self.episodes)

    class Meta:
        ordering = ['id']

class MovieLink(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    link = models.CharField(max_length=1000)
    episode = models.IntegerField()

    def __str__(self) -> str:
        return "%s %s %s" % (self.movie, self.link, self.episode)

class UserRating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    rating = models.FloatField()

    def __str__(self) -> str:
        return "%s %s %s" % (self.user, self.movie, self.rating)