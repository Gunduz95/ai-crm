from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from companies.models import Company
from .models import Campaign, CampaignRecipient
from .serializers import CampaignSerializer, CampaignRecipientSerializer, CampaignDetailSerializer


class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CampaignDetailSerializer
        return CampaignSerializer

    @action(detail=True, methods=['post'])
    def add_recipient(self, request, pk=None):
        campaign = self.get_object()
        company_id = request.data.get('company_id')
        if not Company.objects.filter(pk=company_id).exists():
            return Response({'error': 'Company not found'}, status=status.HTTP_400_BAD_REQUEST)
        if CampaignRecipient.objects.filter(campaign=campaign, company_id=company_id).exists():
            return Response({'error': 'Company already added'}, status=status.HTTP_400_BAD_REQUEST)
        CampaignRecipient.objects.create(campaign=campaign, company_id=company_id)
        return Response({'success': 'Recipient added'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def send_campaign(self, request, pk=None):
        campaign = self.get_object()
        campaign.status = 'sent'
        campaign.save()
        return Response({'success': 'Campaign sent'}, status=status.HTTP_200_OK)


class CampaignRecipientViewSet(viewsets.ModelViewSet):
    queryset = CampaignRecipient.objects.all()
    serializer_class = CampaignRecipientSerializer


