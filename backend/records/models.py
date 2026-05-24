from django.db import models

class EmissionRecord(models.Model):

    SOURCE_CHOICES = [
        ('SAP', 'SAP'),
        ('UTILITY', 'UTILITY'),
        ('TRAVEL', 'TRAVEL'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('APPROVED', 'APPROVED'),
        ('FAILED', 'FAILED'),
        ('WARNING', 'WARNING'),
    ]

    company_name = models.CharField(max_length=100)

    source_type = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES
    )

    raw_value = models.FloatField()

    normalized_value = models.FloatField(
        null=True,
        blank=True
    )

    unit = models.CharField(max_length=20)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.company_name