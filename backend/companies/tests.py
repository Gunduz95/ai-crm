from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Company


class CompanyApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='anna', password='x')

    def test_requires_authentication(self):
        res = self.client.get('/api/companies/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crud(self):
        self.client.force_authenticate(self.user)

        created = self.client.post('/api/companies/', {'name': 'Acme', 'industry': 'Retail', 'email': 'info@acme.test'})
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        self.assertEqual(created.data['status'], 'lead')       # default status
        pk = created.data['id']

        listed = self.client.get('/api/companies/')
        self.assertEqual([c['name'] for c in listed.data], ['Acme'])

        updated = self.client.patch(f'/api/companies/{pk}/', {'status': 'active'})
        self.assertEqual(updated.data['status'], 'active')

        deleted = self.client.delete(f'/api/companies/{pk}/')
        self.assertEqual(deleted.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Company.objects.exists())

    def test_invalid_email_is_rejected(self):
        self.client.force_authenticate(self.user)
        res = self.client.post('/api/companies/', {'name': 'Acme', 'email': 'not-an-email'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', res.data)
