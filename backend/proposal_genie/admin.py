from django.contrib import admin
from .models import Template, KnowledgeBase, Proposal, Section, Collaborator


@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    list_display = ('title', 'success_score', 'created_at')
    search_fields = ('title',)
    list_filter = ('success_score',)


@admin.register(Proposal)
class ProposalAdmin(admin.ModelAdmin):
    list_display = ('title', 'client_name', 'status',
                    'win_probability', 'created_by', 'created_at')
    search_fields = ('title', 'client_name')
    list_filter = ('status',)


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ('title', 'proposal', 'confidence_score',
                    'order', 'updated_at')
    search_fields = ('title',)
    list_filter = ('proposal',)


@admin.register(Collaborator)
class CollaboratorAdmin(admin.ModelAdmin):
    list_display = ('proposal', 'user', 'permission', 'added_at')
    search_fields = ('proposal__title', 'user__email')
    list_filter = ('permission',)
