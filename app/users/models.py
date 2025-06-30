from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone


class UserProfile(models.Model):
    """
    Extended user profile with VIP status information.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_vip = models.BooleanField(default=False, help_text='Whether the user has VIP status')
    vip_since = models.DateTimeField(null=True, blank=True, help_text='Date when user became VIP')
    vip_until = models.DateTimeField(null=True, blank=True, help_text='Date when VIP status expires')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.user.username}'s profile"

    def set_vip_status(self, is_vip, vip_until=None):
        """
        Set VIP status for the user.
        """
        if is_vip and not self.is_vip:
            # User is becoming VIP
            self.is_vip = True
            self.vip_since = timezone.now()
            self.vip_until = vip_until
        elif not is_vip and self.is_vip:
            # User is losing VIP status
            self.is_vip = False
            self.vip_until = timezone.now()
        
        self.save()

    @property
    def is_vip_active(self):
        """
        Check if VIP status is currently active (not expired).
        """
        if not self.is_vip:
            return False
        
        if self.vip_until and timezone.now() > self.vip_until:
            return False
        
        return True


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to automatically create a UserProfile when a User is created.
    """
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal to automatically save the UserProfile when a User is saved.
    """
    instance.profile.save()
