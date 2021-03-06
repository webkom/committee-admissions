# Generated by Django 2.0.3 on 2018-03-13 14:07

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [migrations.swappable_dependency(settings.AUTH_USER_MODEL)]

    operations = [
        migrations.CreateModel(
            name="Admission",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("open_from", models.DateTimeField()),
                ("public_deadline", models.DateTimeField()),
                ("application_deadline", models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name="Committee",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("description", models.TextField(blank=True, max_length=200)),
                ("response_label", models.TextField(blank=True, max_length=200)),
                ("logo", models.FileField(blank=True, upload_to="")),
            ],
            options={"ordering": ["name"]},
        ),
        migrations.CreateModel(
            name="CommitteeApplication",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now, editable=False
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("text", models.TextField(blank=True)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="UserApplication",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        db_index=True, default=django.utils.timezone.now, editable=False
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, editable=False
                    ),
                ),
                ("text", models.TextField(blank=True)),
                ("time_sent", models.DateTimeField(editable=False, null=True)),
                (
                    "admission",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="applications",
                        to="admissions.Admission",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="committeeapplication",
            name="application",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="committee_applications",
                to="admissions.UserApplication",
            ),
        ),
        migrations.AddField(
            model_name="committeeapplication",
            name="committee",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="applications",
                to="admissions.Committee",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="userapplication", unique_together={("admission", "user")}
        ),
    ]
