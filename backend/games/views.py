from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Game, Player, Score
from .serializers import GameSerializer, PlayerSerializer, ScoreSerializer

class GameViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing games.
    Supports multipart/form-data for image uploads.
    """
    queryset = Game.objects.all()
    serializer_class = GameSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class PlayerViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing players.
    Supports multipart/form-data for avatar uploads.
    """
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ScoreViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing scores.
    """
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

