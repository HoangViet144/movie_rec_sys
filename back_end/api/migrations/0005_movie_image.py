# Generated by Django 3.2.9 on 2021-12-11 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_user_is_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='image',
            field=models.CharField(default='', max_length=1000),
        ),
    ]
