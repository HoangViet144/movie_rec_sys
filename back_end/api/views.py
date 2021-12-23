from .apps import ApiConfig
import pandas as pd

from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.conf import settings
from django.db.models import F

from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.backends import TokenBackend

from .serializers import UserSerializer, UserLoginSerializer, MovieSerializer, MovieLinkSerializer, UserRatingSerializer, UserGetRatingSerializer
from .models import Movie, MovieLink, User, UserRating
from .permission import MoviePermission
from .viewset import CreateViewSet

class UserRegisterViewSet(CreateViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    def create(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data['password'] = make_password(
                serializer.validated_data['password'])
            serializer.save()

            return JsonResponse({
                'message': 'Register successful!'
            }, status=status.HTTP_201_CREATED)

        else:
            return JsonResponse({
                'error_message': 'This email has already exist!',
                'errors_code': 400,
            }, status=status.HTTP_400_BAD_REQUEST)

class UserLoginViewSet(CreateViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    def create(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                username=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )
            if user:
                refresh = TokenObtainPairSerializer.get_token(user)
                data = {
                    'refresh_token': str(refresh),
                    'access_token': str(refresh.access_token),
                    'access_expires': int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                    'refresh_expires': int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
                }
                return JsonResponse(data, status=status.HTTP_200_OK)

            return JsonResponse({
                'error_message': 'Email or password is incorrect!',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

        return JsonResponse({
            'error_messages': serializer.errors,
            'error_code': 400
        }, status=status.HTTP_400_BAD_REQUEST)


# class UserLogoutView(APIView):
#     def get(self, request, format=None):
#         request.user.auth_token.delete()
#         return JsonResponse({}, status=status.HTTP_200_OK)

class MovieViewSet(viewsets.ModelViewSet):
    permission_classes = (MoviePermission,)
    queryset = Movie.objects.all().order_by('id')
    serializer_class = MovieSerializer

class MovieLinkViewSet(viewsets.ModelViewSet):
    permission_classes = (MoviePermission,)
    queryset = MovieLink.objects.all().order_by('id')
    serializer_class = MovieLinkSerializer

class UserRatingView(APIView):
    def post(self, request):
        serializer = UserRatingSerializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({
                'error_messages': 'ahhaha zua',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

        token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
       
        try:
            valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
            userid = valid_data['user_id']
            user = User.objects.get(pk=userid)
            movie = Movie.objects.get(pk=serializer.validated_data["movieid"])

            print(user.id, movie.id)
            
            curRating = UserRating.objects.filter(user=user)
            if len(curRating) == 0:
                retrainModel()

            userrating, created = UserRating.objects.get_or_create(
                user=user.id, movie=movie.id, defaults={"user": user, "movie": movie, "rating": 0})
            
            if request.path == '/api/watching':
                userrating.rating = min(9, userrating.rating  + serializer.validated_data["rating"])
            else:
                userrating.rating = serializer.validated_data["rating"]
            userrating.save()

            return JsonResponse({
                'messages': 'success',
                'error_code': 200
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)
       
class UserGetRatingView(APIView):
    def post(self, request):
        serializer = UserGetRatingSerializer(data=request.data)

        if not serializer.is_valid():
            return JsonResponse({
                'error_messages': 'ahhaha zua',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

        token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
       
        try:
            valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
            userid = valid_data['user_id']

            user = User.objects.get(pk=userid)
            movie = Movie.objects.get(pk=serializer.validated_data["movieid"])

            userrating, created =  UserRating.objects.get_or_create(
                user=user.id, movie=movie.id, defaults={"user": user, "movie": movie, "rating": 0})

            print(userrating.rating)

            return JsonResponse({
                'rating': userrating.rating
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

class UserGetAllRatingView(APIView):
    def get(self, request):
        token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
       
        try:
            valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
            userid = valid_data['user_id']

            user = User.objects.get(pk=userid)
            userrates = UserRating.objects.filter(user=user)

            result = []

            for userrate in userrates:
                result.append({'id': userrate.movie.id, 'name': userrate.movie.name, 'rating': userrate.rating})


            return JsonResponse({
                'rating': result
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

class TrainModelView(APIView):
    # permission_classes = (MoviePermission,)

    def get(self, request):      
        try:
            retrainModel()
            return JsonResponse({
                'error_messages': "successful"
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

class SuggestionView(APIView):

    def get(self, request):      
        try:
            token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
            valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
            userid = valid_data['user_id']

            movieids = ApiConfig.model.predict(user_id=userid)

            print(len(movieids))

            result =[{
                'id': movie.id, 
                'name': movie.name, 
                'genre': movie.genre, 
                'episodes': movie.episodes,
                'image': movie.image
                } for movie in Movie.objects.filter(pk__in=movieids)]

            return JsonResponse({
                'result': result
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

class MovieRatingView(APIView):

    def get(self, request):      
        try:
            token = request.META.get('HTTP_AUTHORIZATION', " ").split(' ')[1]
            valid_data = TokenBackend(algorithm='HS256').decode(token,verify=False)
            userid = valid_data['user_id']
            user = User.objects.get(pk=userid)

            movies = Movie.objects.all()

            result = []
            for movie in movies:
                try:
                    rating = UserRating.objects.get(movie= movie, user = user).rating
                except UserRating.DoesNotExist:
                    rating = 0

                result.append({
                    "id":movie.id,
                    "name": movie.name,
                    "genre": movie.genre,
                    "episodes": movie.episodes,
                    'image': movie.image,
                    "rating": rating
                })


            return JsonResponse({
                "result": result
            }, status=status.HTTP_200_OK)
       
        except Exception as v:
            print("validation error", v)

            return JsonResponse({
                'error_messages': 'invalid request',
                'error_code': 400
            }, status=status.HTTP_400_BAD_REQUEST)

def retrainModel():
    print("re train model now...")
    df = pd.DataFrame(list(UserRating.objects.all().values()))
    df = df.drop('id', axis=1)
    df.columns = ['user_id', 'anime_id', 'rating']

    ApiConfig.model.read_data(df_rating=df)
    ApiConfig.model.build(K = 2, lam = 0.1, print_every = 1, print_time=True,learning_rate = 2, max_iter = 1, user_based = 0)
    ApiConfig.model.fit()
    print("re train model finish...")