from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class SignUpLoginTests(APITestCase):
    def test_signup_returns_tokens_and_creates_user(self):
        res = self.client.post('/api/accounts/signup/', {'username': 'anna', 'password': 'S3cure-pass!'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('access', res.data)
        self.assertIn('refresh', res.data)
        self.assertTrue(User.objects.filter(username='anna').exists())

    def test_duplicate_username_is_rejected(self):
        User.objects.create_user(username='anna', password='x')
        res = self.client.post('/api/accounts/signup/', {'username': 'anna', 'password': 'S3cure-pass!'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_missing_fields_are_rejected(self):
        res = self.client.post('/api/accounts/signup/', {'username': 'anna'})
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_and_refresh(self):
        User.objects.create_user(username='anna', password='S3cure-pass!')
        res = self.client.post('/api/accounts/login/', {'username': 'anna', 'password': 'S3cure-pass!'})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        refreshed = self.client.post('/api/accounts/token/refresh/', {'refresh': res.data['refresh']})
        self.assertEqual(refreshed.status_code, status.HTTP_200_OK)
        self.assertIn('access', refreshed.data)

    def test_wrong_password_is_rejected(self):
        User.objects.create_user(username='anna', password='S3cure-pass!')
        res = self.client.post('/api/accounts/login/', {'username': 'anna', 'password': 'wrong'})
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
