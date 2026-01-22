from django.db import models

class Game(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Player(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Score(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='scores')
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='scores')
    score = models.IntegerField()
    is_winner = models.BooleanField(default=False)
    played_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player.name} - {self.game.name}: {self.score}"
