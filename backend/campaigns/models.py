from django.db import models
from companies.models import Company

class Campaign(models.Model):
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sent', 'Sent'),
    ]

    name = models.CharField(max_length=200)
    subject = models.CharField(max_length=200)
    template = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    scheduled_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

    
class CampaignRecipient(models.Model):
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='recipients')
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.campaign.name} → {self.company.name}"