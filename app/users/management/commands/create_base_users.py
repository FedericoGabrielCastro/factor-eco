from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.db import transaction

class Command(BaseCommand):
    help = 'Ensures there are at least 10 base users for login testing.'

    def handle(self, *args, **options):
        usernames = [
            f'testuser{i}' for i in range(1, 11)
        ]
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