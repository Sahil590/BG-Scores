from rest_framework import serializers
from .models import Game, Player, Score

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = '__all__'

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'

class ScoreSerializer(serializers.ModelSerializer):
    game_name = serializers.ReadOnlyField(source='game.name')
    player_name = serializers.ReadOnlyField(source='player.name')

    class Meta:
        model = Score
        fields = ['id', 'game', 'player', 'score', 'is_winner', 'played_at', 'game_name', 'player_name']
