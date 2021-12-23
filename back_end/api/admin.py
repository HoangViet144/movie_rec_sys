from django.contrib import admin
from api.models import User, Movie, MovieLink, UserRating

# Register your models here.
admin.site.register(User)
admin.site.register(Movie)
admin.site.register(MovieLink)
admin.site.register(UserRating)
