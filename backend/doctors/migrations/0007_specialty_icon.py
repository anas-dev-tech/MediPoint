# Generated by Django 5.1.6 on 2025-02-14 23:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('doctors', '0006_alter_schedule_day'),
    ]

    operations = [
        migrations.AddField(
            model_name='specialty',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='specialty/icons'),
        ),
    ]
