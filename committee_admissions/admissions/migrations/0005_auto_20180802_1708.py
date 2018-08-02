# Generated by Django 2.0.3 on 2018-08-02 17:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('auth', '0009_alter_user_last_name_max_length'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('admissions', '0004_auto_20180802_1704'),
    ]

    operations = [
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('member', 'member'), ('leader', 'leader'), ('co-leader', 'co-leader'), ('treasurer', 'treasurer'), ('recruiting', 'recruiting'), ('development', 'development'), ('editor', 'editor'), ('retiree', 'retiree'), ('media_relations', 'media_relations'), ('active_retiree', 'active_retiree'), ('alumni', 'alumni'), ('webmaster', 'webmaster'), ('interest_group_admin', 'interest_group_admin'), ('alumni_admin', 'alumni_admin'), ('retiree_email', 'retiree_email'), ('company_admin', 'company_admin'), ('dugnad_admin', 'dugnad_admin'), ('trip_admin', 'trip_admin'), ('sponsor_admin', 'sponsor_admin'), ('social_admin', 'social_admin')], default='member', max_length=30)),
                ('abakus_group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='auth.Group')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='membership',
            unique_together={('user', 'abakus_group')},
        ),
    ]
