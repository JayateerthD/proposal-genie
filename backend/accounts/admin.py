from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'company',
                    'job_title', 'department', 'is_active', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'company')
    list_filter = ('is_active', 'company', 'department')
