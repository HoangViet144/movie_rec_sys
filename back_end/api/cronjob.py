import pandas as pd
from models import UserRating
from apps import ApiConfig

def re_train_daily():
  print("re train model daily")
  df = pd.DataFrame(list(UserRating.objects.all().values()))
  df = df.drop('id', axis=1)
  df.columns = ['user_id', 'anime_id', 'rating']
  print(df.head())

  ApiConfig.model.read_data(df_rating=df)
  ApiConfig.model.build(K = 2, lam = 0.1, print_every = 1, print_time=True,learning_rate = 2, max_iter = 1, user_based = 0)
  ApiConfig.model.fit()