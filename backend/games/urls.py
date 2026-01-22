from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameViewSet, PlayerViewSet, ScoreViewSet

router = DefaultRouter()
router.register(r'games', GameViewSet)
router.register(r'players', PlayerViewSet)
router.register(r'scores', ScoreViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
