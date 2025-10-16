#!/bin/bash
# Migration script: Add created dates and update status values for all notes
# Run from: sites/commune-publish directory

set -e

NOTES_DIR="src/content/notes"

echo "=== Note Metadata Migration ==="
echo ""

# Step 1: Extract created dates from git history
echo "Step 1: Extracting created dates from git history..."
echo ""

for file in "$NOTES_DIR"/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")

    # Get first commit date for this file
    created_date=$(git log --diff-filter=A --follow --format=%aI -- "$file" | tail -1 | cut -d'T' -f1)

    if [ -n "$created_date" ]; then
      echo "  $filename -> created: $created_date"

      # Check if file already has created field
      if grep -q "^created:" "$file"; then
        echo "    (already has created field, skipping)"
      else
        # Add created field after title (assumes frontmatter starts with ---)
        # This adds it as the second field in frontmatter
        sed -i '' "/^title:/a\\
created: $created_date
" "$file"
      fi
    else
      echo "  $filename -> No git history found (new file?)"
    fi
  fi
done

echo ""
echo "Step 2: Updating status values (seed/growing/evergreen → draft/live/updated)..."
echo ""

# Status migration mapping:
# seed → draft (early stage, not ready)
# growing → live (published, actively maintained)
# evergreen → live (mature, stable content)
# Note: You may want to manually mark recently updated "evergreen" notes as "updated"

for file in "$NOTES_DIR"/*.md; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")

    # Replace status values
    if grep -q "status: seed" "$file"; then
      sed -i '' 's/status: seed/status: draft/' "$file"
      echo "  $filename: seed → draft"
    elif grep -q "status: growing" "$file"; then
      sed -i '' 's/status: growing/status: live/' "$file"
      echo "  $filename: growing → live"
    elif grep -q "status: evergreen" "$file"; then
      sed -i '' 's/status: evergreen/status: live/' "$file"
      echo "  $filename: evergreen → live"
    fi
  fi
done

echo ""
echo "=== Migration Complete ==="
echo ""
echo "Next steps:"
echo "1. Review changes: git diff $NOTES_DIR"
echo "2. Manually mark recently updated notes as 'status: updated' if desired"
echo "3. Test build: npm run build"
echo "4. Commit changes: git add . && git commit -m 'feat: migrate note metadata to new schema'"
