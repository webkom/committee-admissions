# Generated by Django 2.0.3 on 2018-08-04 19:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [("admissions", "0006_auto_20180804_1807")]

    operations = [
        migrations.AddField(
            model_name="committee",
            name="detail_link",
            field=models.CharField(default="", max_length=150),
        )
    ]
