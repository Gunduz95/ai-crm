from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from companies.models import Company
from .models import Campaign, CampaignRecipient


class CampaignApiTests(APITestCase):
    def setUp(self):
        self.client.force_authenticate(User.objects.create_user(username='anna', password='x'))
        self.company = Company.objects.create(name='Acme')
        self.campaign = Campaign.objects.create(name='Spring promo', subject='Hello', template='Hi {name}')

    def test_new_campaign_is_draft(self):
        res = self.client.post('/api/campaigns/', {'name': 'Autumn', 'subject': 'Hi', 'template': 'Body'})
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'draft')

    def test_add_recipient_once(self):
        url = f'/api/campaigns/{self.campaign.id}/add_recipient/'
        first = self.client.post(url, {'company_id': self.company.id})
        self.assertEqual(first.status_code, status.HTTP_201_CREATED)

        again = self.client.post(url, {'company_id': self.company.id})
        self.assertEqual(again.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(CampaignRecipient.objects.count(), 1)

    def test_add_unknown_company_is_rejected(self):
        res = self.client.post(f'/api/campaigns/{self.campaign.id}/add_recipient/', {'company_id': 9999})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(CampaignRecipient.objects.exists())

    def test_detail_lists_recipients_with_company_name(self):
        CampaignRecipient.objects.create(campaign=self.campaign, company=self.company)
        res = self.client.get(f'/api/campaigns/{self.campaign.id}/')
        self.assertEqual(res.data['recipients'][0]['company_name'], 'Acme')

    def test_send_campaign_marks_it_sent(self):
        res = self.client.post(f'/api/campaigns/{self.campaign.id}/send_campaign/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.campaign.refresh_from_db()
        self.assertEqual(self.campaign.status, 'sent')
