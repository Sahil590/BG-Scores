#!/bin/bash

# Cleanup script for removing legacy Django + React files
# Run this ONLY after confirming the Next.js app works properly

echo "=================================================="
echo "   BG Scores - Legacy Files Cleanup Script"
echo "=================================================="
echo ""
echo "This script will remove the old Django and React files."
echo "Make sure your Next.js app is working before proceeding!"
echo ""
read -p "Have you tested the Next.js app and confirmed it works? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Cleanup cancelled. Test the app first!"
    exit 0
fi

echo ""
echo "Starting cleanup..."
echo ""

# Remove Django backend
if [ -d "backend" ]; then
    echo "  Removing backend/ (Django)..."
    rm -rf backend/
    echo "    ✓ Removed"
fi

# Remove React frontend
if [ -d "frontend" ]; then
    echo "  Removing frontend/ (React + Vite)..."
    rm -rf frontend/
    echo "    ✓ Removed"
fi

# Remove Python requirements
if [ -f "requirements.txt" ]; then
    echo "  Removing requirements.txt..."
    rm requirements.txt
    echo "    ✓ Removed"
fi

# Remove legacy docs (optional)
echo ""
read -p "Remove legacy documentation files? (yes/no): " remove_docs

if [ "$remove_docs" = "yes" ]; then
    [ -f "VERCEL_BLOB_SETUP.md" ] && rm VERCEL_BLOB_SETUP.md && echo "    ✓ Removed VERCEL_BLOB_SETUP.md"
    [ -f "DEPLOYMENT_CHECKLIST.md" ] && rm DEPLOYMENT_CHECKLIST.md && echo "    ✓ Removed DEPLOYMENT_CHECKLIST.md"
    [ -f "README.md.backup" ] && rm README.md.backup && echo "    ✓ Removed README.md.backup"
fi

echo ""
echo "=================================================="
echo "   Cleanup Complete!"
echo "=================================================="
echo ""
echo "Removed files:"
echo "  - backend/ (Django REST API)"
echo "  - frontend/ (React + Vite)"
echo "  - requirements.txt (Python dependencies)"
if [ "$remove_docs" = "yes" ]; then
    echo "  - Legacy documentation files"
fi
echo ""
echo "Your project is now 100% Next.js!"
echo ""
echo "Next steps:"
echo "  1. Commit the changes: git add . && git commit -m 'Remove legacy Django/React files'"
echo "  2. Push to GitHub: git push"
echo "  3. Deploy on Vercel automatically"
echo ""
