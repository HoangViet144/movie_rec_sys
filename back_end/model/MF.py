import pandas as pd
from model.MF_core import MF_core

class MF:
    def __init__(self):
        pass
        
    def read_data(self, df_rating):
        self.train_set = df_rating
        self.user_ids = list(set(self.train_set['user_id'].values))
        self.rate_train = self.train_set.to_numpy().copy()

        print("len userid ",len(self.user_ids))
        
        # indices start from 0
        self.rate_train[:, 2] -= 1
        print("rate train", self.rate_train)

        
    def build(self, K = 10, lam = .1, print_every = 10, 
            learning_rate = 0.75, max_iter = 100, print_time=False,
            user_based = 0 
            ):
        self.MF_obj = MF_core(self.rate_train, K=K, lam = lam, 
            print_every = print_every, learning_rate = learning_rate, 
            max_iter = max_iter, user_based = user_based, print_time=print_time)
        
    def fit(self):
        self.MF_obj.fit()

    def predict(self, user_id):
        if user_id not in self.user_ids: 
            df_tmp = self.train_set.groupby(['anime_id'])['rating'].sum().reset_index()
            df_tmp['count'] = df_tmp['anime_id'].map(self.train_set['anime_id'].value_counts())
            df_tmp = df_tmp.sort_values(["count", "rating"], ascending = (False, False))
            return df_tmp['anime_id'].tolist()[0:20]
        pred = self.MF_obj.pred_for_user(user_id)
        pred = sorted(pred, key=lambda x: x[1], reverse=True)
        pred = [i[0] for i in pred]
        return pred[0: 20]
        
    def update_rating(self, user_id, movie_id, rating, out_file=None):
        flag = False
        for i in range(len(self.train_set)):
            if self.train_set['user_id'][i]==user_id and \
                self.train_set['anime_id'][i]==movie_id:
                self.train_set['rating'][i]=rating
                flag = True
                break
        if not flag:
            new_df = pd.DataFrame(
                {'user_id': [user_id], 'anime_id': [movie_id], 'rating': [rating]})
            self.train_set = self.train_set.append(new_df, ignore_index=True)
        self.train_set = self.train_set.sort_values(by=['user_id', 'anime_id'])
        self.train_set = self.train_set.reset_index().drop(columns=['index'])
        
        if out_file is not None:
            self.train_set.to_csv(out_file)
        else:
            self.train_set.to_csv(self.train_file)
        
    def eval(self):
        # evaluate on test data
        RMSE = self.MF_obj.evaluate_RMSE(self.rate_test)
        print('\nRMSE =', RMSE)
    
    def split_train_test(file, test_size, train_dir, test_dir):
        df = pd.read_csv(file)[['user_id', 'anime_id', 'rating']]
        from sklearn.model_selection import train_test_split
        df_train, df_test, _, _ = train_test_split(df, [0]*len(df), test_size=test_size)
        df_train = df_train.reset_index().drop(columns=['index'])
        df_test = df_test.reset_index().drop(columns=['index'])
        
        swap_idx=[]
        for i in range(len(df_test)):
            if df_test['user_id'][i] not in df_train['user_id'].values:
                swap_idx += [i]
                
        df_train = df_train.append(df_test.iloc[swap_idx, :])
        df_test = df_test.drop(swap_idx)
        
        df_train = df_train.sort_values(by=['user_id', 'anime_id'])
        df_train = df_train.reset_index().drop(columns=['index'])
        df_test = df_test.sort_values(by=['user_id', 'anime_id'])
        df_test = df_test.reset_index().drop(columns=['index'])
        
        df_train.to_csv(train_dir)
        df_test.to_csv(test_dir)
                                    
    

