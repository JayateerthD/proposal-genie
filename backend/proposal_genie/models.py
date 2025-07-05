from django.db import models
from django.conf import settings


class Template(models.Model):
    name = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class KnowledgeBase(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    embeddings = models.BinaryField()
    success_score = models.FloatField()
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)


class Proposal(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    title = models.CharField(max_length=200)
    client_name = models.CharField(max_length=200)
    requirements = models.JSONField(default=dict)
    template = models.ForeignKey(
        Template, on_delete=models.SET_NULL, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    win_probability = models.FloatField(default=0.0)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Section(models.Model):
    proposal = models.ForeignKey(
        Proposal, on_delete=models.CASCADE, related_name='sections')
    title = models.CharField(max_length=200)
    content = models.TextField()
    ai_metadata = models.JSONField(default=dict)
    confidence_score = models.FloatField(default=0.0)
    order = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)


class Collaborator(models.Model):
    PERMISSION_CHOICES = [
        ('view', 'View Only'),
        ('edit', 'Edit'),
        ('admin', 'Admin'),
    ]

    proposal = models.ForeignKey(
        Proposal, on_delete=models.CASCADE, related_name='collaborators')
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    permission = models.CharField(
        max_length=10, choices=PERMISSION_CHOICES, default='view')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['proposal', 'user']
