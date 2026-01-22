from rest_framework import serializers
from .models import Game, Player, Score

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'name', 'image', 'created_at']

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'name', 'avatar', 'created_at']

class ScoreSerializer(serializers.ModelSerializer):
    game_name = serializers.ReadOnlyField(source='game.name')
    player_name = serializers.ReadOnlyField(source='player.name')

    class Meta:
        model = Score
        fields = ['id', 'game', 'player', 'score', 'is_winner', 'played_at', 'game_name', 'player_name']
