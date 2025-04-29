from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone

class Film(models.Model):
    title = models.CharField(max_length=200, verbose_name="Назва фільму")
    duration = models.DurationField(verbose_name="Тривалість")  # Наприклад, "02:30:00" для 2 годин 30 хвилин

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Фільм"
        verbose_name_plural = "Фільми"

class Hall(models.Model):
    name = models.CharField(max_length=100, verbose_name="Назва залу")
    capacity = models.PositiveIntegerField(verbose_name="Місткість")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Зал"
        verbose_name_plural = "Зали"

class Schedule(models.Model):
    film = models.ForeignKey(Film, on_delete=models.CASCADE, verbose_name="Фільм")
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE, verbose_name="Зал")
    start_time = models.DateTimeField(verbose_name="Час початку")

    def end_time(self):
        return self.start_time + self.film.duration

    def clean(self):
        # Перевірка на конфлікти часу в одному залі
        overlapping = Schedule.objects.filter(
            hall=self.hall,
            start_time__lt=self.end_time(),
            start_time__gte=self.start_time - self.film.duration
        ).exclude(id=self.id)
        if overlapping.exists():
            raise ValidationError(f"Зал {self.hall} зайнятий у цей час.")

    def save(self, *args, **kwargs):
        self.full_clean()  # Викликаємо перевірку перед збереженням
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.film} у {self.hall} о {self.start_time}"

    class Meta:
        verbose_name = "Розклад"
        verbose_name_plural = "Розклад"