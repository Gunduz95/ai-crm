from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CampaignViewSet, CampaignRecipientViewSet

router = DefaultRouter()
router.register('', CampaignViewSet)

recipient_router = DefaultRouter()
recipient_router.register('', CampaignRecipientViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('recipients/', include(recipient_router.urls)),
]
