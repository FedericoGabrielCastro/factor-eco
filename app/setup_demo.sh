#!/bin/bash

set -e

# Install dependencies
poetry install

# Remove old SQLite database (if exists)
rm -f ../db.sqlite3

# Run migrations
poetry run python manage.py migrate

# Create base products (force)
poetry run python manage.py ensure_base_products --force

# Create base users
poetry run python manage.py create_base_users

# Start development server
poetry run python manage.py runserver 0.0.0.0:8000 