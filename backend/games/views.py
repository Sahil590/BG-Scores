from rest_framework import viewsets
from .models import Game, Player, Score
from .serializers import GameSerializer, PlayerSerializer, ScoreSerializer

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class ScoreViewSet(viewsets.ModelViewSet):
    queryset = Score.objects.all()
    serializer_class = ScoreSerializer

