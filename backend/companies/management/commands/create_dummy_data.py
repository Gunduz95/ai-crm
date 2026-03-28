from django.core.management.base import BaseCommand
from companies.models import Company
from campaigns.models import Campaign, CampaignRecipient


class Command(BaseCommand):
    help = 'Creates dummy data for testing'

    def handle(self, *args, **options):
        # Delete old data
        Company.objects.all().delete()
        Campaign.objects.all().delete()

        # Create companies
        companies_data = [
            {'name': 'Google', 'industry': 'Technology', 'email': 'contact@google.com', 'phone': '+1-650-253-0000', 'employees_count': 180000, 'status': 'active', 'website': 'https://google.com'},
            {'name': 'Stripe', 'industry': 'Fintech', 'email': 'info@stripe.com', 'phone': '+1-888-926-2289', 'employees_count': 8000, 'status': 'active', 'website': 'https://stripe.com'},
            {'name': 'Shopify', 'industry': 'E-commerce', 'email': 'contact@shopify.com', 'phone': '+1-613-241-2828', 'employees_count': 10000, 'status': 'active', 'website': 'https://shopify.com'},
            {'name': 'Slack', 'industry': 'Technology', 'email': 'hello@slack.com', 'phone': '+1-415-630-7943', 'employees_count': 2500, 'status': 'active', 'website': 'https://slack.com'},
            {'name': 'HubSpot', 'industry': 'Marketing', 'email': 'info@hubspot.com', 'phone': '+1-888-482-7768', 'employees_count': 7000, 'status': 'lead', 'website': 'https://hubspot.com'},
            {'name': 'Zoom', 'industry': 'Technology', 'email': 'contact@zoom.us', 'phone': '+1-888-799-9666', 'employees_count': 6800, 'status': 'active', 'website': 'https://zoom.us'},
            {'name': 'Notion', 'industry': 'Technology', 'email': 'team@notion.so', 'phone': '+1-415-555-0100', 'employees_count': 1500, 'status': 'lead', 'website': 'https://notion.so'},
            {'name': 'Datadog', 'industry': 'Technology', 'email': 'info@datadog.com', 'phone': '+1-866-329-4466', 'employees_count': 5000, 'status': 'active', 'website': 'https://datadog.com'},
            {'name': 'Twilio', 'industry': 'Telecom', 'email': 'sales@twilio.com', 'phone': '+1-888-898-4546', 'employees_count': 7800, 'status': 'inactive', 'website': 'https://twilio.com'},
            {'name': 'Figma', 'industry': 'Design', 'email': 'hello@figma.com', 'phone': '+1-415-555-0200', 'employees_count': 1200, 'status': 'lead', 'website': 'https://figma.com'},
        ]

        created_companies = []
        for data in companies_data:
            company = Company.objects.create(**data)
            created_companies.append(company)
            self.stdout.write(f'  Created company: {company.name}')

        # Create campaigns
        campaign1 = Campaign.objects.create(
            name='Spring Promo 2026',
            subject='Special offer for {company_name}',
            template='Hello {company_name},\n\nWe have a special spring offer for your team of {employees_count} people.\n\nBest regards,\nOur Team',
            status='draft',
        )
        campaign2 = Campaign.objects.create(
            name='Product Launch',
            subject='Introducing our new product',
            template='Dear {company_name},\n\nWe are excited to announce our new product launch.\n\nBest,\nOur Team',
            status='sent',
        )

        self.stdout.write(f'  Created campaign: {campaign1.name}')
        self.stdout.write(f'  Created campaign: {campaign2.name}')

        # Add recipients to campaigns
        for company in created_companies[:5]:
            CampaignRecipient.objects.create(campaign=campaign1, company=company)
        for company in created_companies[3:8]:
            CampaignRecipient.objects.create(campaign=campaign2, company=company, sent=True)

        self.stdout.write(self.style.SUCCESS('\nDummy data created successfully!'))
