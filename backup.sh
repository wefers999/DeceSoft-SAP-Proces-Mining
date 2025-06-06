#!/bin/bash

# Get current date in YYYY-MM-DD format
BACKUP_DATE=$(date +%Y-%m-%d)
BACKUP_BRANCH="backup-$BACKUP_DATE"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting GitHub backup process...${NC}"

# Create and switch to new backup branch
echo -e "${BLUE}Creating backup branch: $BACKUP_BRANCH${NC}"
git checkout -b $BACKUP_BRANCH

# Add all changes
echo -e "${BLUE}Adding all changes...${NC}"
git add .

# Commit changes
echo -e "${BLUE}Committing changes...${NC}"
git commit -m "Backup $BACKUP_DATE: Project state backup"

# Push to GitHub
echo -e "${BLUE}Pushing to GitHub...${NC}"
git push -u origin $BACKUP_BRANCH

# Return to main branch
echo -e "${BLUE}Switching back to main branch...${NC}"
git checkout main

echo -e "${GREEN}Backup completed successfully!${NC}"
echo -e "${GREEN}Backup branch: $BACKUP_BRANCH${NC}"
echo -e "${GREEN}You can view your backup at: https://github.com/wefers999/DeceSoft-SAP-Proces-Mining/branches${NC}" 