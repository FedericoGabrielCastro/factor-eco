from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile


class UserProfileInline(admin.StackedInline):
    """
    Inline admin for UserProfile model.
    """
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'User Profile'
    fk_name = 'user'


class UserAdmin(BaseUserAdmin):
    """
    Custom User admin that includes UserProfile inline.
    """
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_vip_status')
    list_filter = ('profile__is_vip', 'is_staff', 'is_superuser', 'is_active')

    def get_vip_status(self, obj):
        """
        Display VIP status in the admin list.
        """
        return obj.profile.is_vip if hasattr(obj, 'profile') else False
    get_vip_status.boolean = True
    get_vip_status.short_description = 'VIP Status'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    Admin interface for UserProfile model.
    """
    list_display = ('user', 'is_vip', 'vip_since', 'vip_until', 'is_vip_active', 'created_at')
    list_filter = ('is_vip', 'vip_since', 'vip_until', 'created_at')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'

    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('VIP Status', {
            'fields': ('is_vip', 'vip_since', 'vip_until')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
