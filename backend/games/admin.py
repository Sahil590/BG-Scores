from django.contrib import admin
from .models import Game, Player, Score

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'has_image']
    search_fields = ['name']
    list_filter = ['created_at']
    
    def has_image(self, obj):
        return bool(obj.image)
    has_image.boolean = True
    has_image.short_description = 'Has Image'

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at', 'has_avatar']
    search_fields = ['name']
    list_filter = ['created_at']
    
    def has_avatar(self, obj):
        return bool(obj.avatar)
    has_avatar.boolean = True
    has_avatar.short_description = 'Has Avatar'

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ['player', 'game', 'score', 'is_winner', 'played_at']
    list_filter = ['is_winner', 'played_at', 'game']
    search_fields = ['player__name', 'game__name']
    date_hierarchy = 'played_at'
