from django.apps import AppConfig
from model.MF import MF
import pandas as pd

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    model = MF()
    def ready(self):
        from api.views import retrainModel

        retrainModel()