from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from users.models import UserProfile

class Command(BaseCommand):
    help = 'Ensures there are at least 10 base users for login testing.'

    def handle(self, *args, **options):
        usernames = [
            f'testuser{i}' for i in range(1, 11)
        ]
        # Delete old test users, VIP users, and ex-VIP users
        User.objects.filter(username__startswith='testuser').delete()
        User.objects.filter(username__startswith='vipuser').delete()
        User.objects.filter(username__startswith='exvipuser').delete()
        
        password = 'testpassword123'
        created_count = 0
        with transaction.atomic():
            for username in usernames:
                if not User.objects.filter(username=username).exists():
                    User.objects.create_user(
                        username=username,
                        email=f'{username}@example.com',
                        password=password,
                        first_name=f'Test{username.capitalize()}',
                        last_name='User'
                    )
                    created_count += 1
        self.stdout.write(self.style.SUCCESS(
            f'Successfully ensured 10 base users. Created {created_count} new users.'
        ))
        self.stdout.write('All base users have password: testpassword123')
        self.stdout.write('Usernames: ' + ', '.join(usernames))

        # Add 2 active VIP users
        now = timezone.now()
        for i in range(1, 3):
            username = f'vipuser{i}'
            user = User.objects.create_user(
                username=username,
                email=f'{username}@example.com',
                password=password,
                first_name=f'VIP{i}',
                last_name='User'
            )
            UserProfile.objects.filter(user=user).update(is_vip=True, vip_since=now, vip_until=None)
        # Add 2 ex-VIP users
        old_date = now.replace(year=now.year - 1)
        for i in range(1, 3):
            username = f'exvipuser{i}'
            user = User.objects.create_user(
                username=username,
                email=f'{username}@example.com',
                password=password,
                first_name=f'ExVIP{i}',
                last_name='User'
            )
            UserProfile.objects.filter(user=user).update(is_vip=False, vip_since=old_date, vip_until=old_date)
        self.stdout.write(self.style.SUCCESS('Added 2 active VIP users and 2 ex-VIP users.')) 