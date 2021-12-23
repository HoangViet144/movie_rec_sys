from django.urls import include, path
from rest_framework import routers

from .views import UserLoginViewSet, MovieViewSet, MovieLinkViewSet, UserRatingView, UserRegisterViewSet, UserGetRatingView
from .views import TrainModelView, SuggestionView, UserGetAllRatingView, MovieRatingView

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'movieslink', MovieLinkViewSet)
router.register(r'movies', MovieViewSet)
router.register(r'register', UserRegisterViewSet)
router.register(r'login', UserLoginViewSet)

urlpatterns = [
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('rating', UserRatingView.as_view(), name='rating'),
    path('watching', UserRatingView.as_view(), name='watching'),
    path('get-rating', UserGetRatingView.as_view(), name='get-rating'),
    path('train-model', TrainModelView.as_view(), name='train-model'),
    path('suggestion', SuggestionView.as_view(), name='suggestion'),
    path('get-all-rating', UserGetAllRatingView.as_view(), name='get-all-rating'),
    path('movies-rating', MovieRatingView.as_view(), name='movie-rating'),
    path('', include(router.urls)),
]

