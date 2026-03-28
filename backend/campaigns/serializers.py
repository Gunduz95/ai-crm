from rest_framework import serializers
from .models import Campaign, CampaignRecipient


class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'


class CampaignRecipientSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)

    class Meta:
        model = CampaignRecipient
        fields = '__all__'


class CampaignDetailSerializer(serializers.ModelSerializer):
    recipients = CampaignRecipientSerializer(many=True, read_only=True)

    class Meta:
        model = Campaign
        fields = '__all__'

