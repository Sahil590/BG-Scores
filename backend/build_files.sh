#!/bin/bash

# Build script for Vercel deployment
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Collecting static files..."
python3.9 backend/manage.py collectstatic --noinput --clear

echo "Running database migrations..."
python3.9 backend/manage.py migrate --noinput

echo "Build complete!"
