#!/bin/bash

# Script to convert .mmd files to .md files with mermaid format
# Converts click links from .mmd to .md

# Base path for converted files
BASE_DOCS_PATH="/-/blob/main/sa/docs"

# Create sa/docs directory if it doesn't exist
mkdir -p sa/docs

# Initialize summary file
echo "# Documentation Summary" > sa/docs/SUMMARY.md
echo "" >> sa/docs/SUMMARY.md

# Find all .mmd files in sa/diagrams recursively
find sa/diagrams -name "*.mmd" -type f | while read -r mmd_file; do
    # Get the directory and filename
    dir_path=$(dirname "$mmd_file")
    filename=$(basename "$mmd_file" .mmd)
    
    # Create corresponding directory structure in sa/docs (remove sa/diagrams prefix)
    relative_path=${dir_path#sa/diagrams/}
    docs_dir="sa/docs/$relative_path"
    mkdir -p "$docs_dir"
    
    md_file="$docs_dir/$filename.md"
    
    # Extract title from filename (capitalize first letter)
    title=$(echo "$filename" | sed 's/.*/&/')
    
    # Read the content of .mmd file
    content=$(cat "$mmd_file")
    
    # Replace .mmd with .md in click links and add full path dynamically
    content=$(echo "$content" | sed 's|"\.\./\([^"]*\)\.mmd"|"/-/blob/main/sa/docs/billing/biling-kit/\1.md"|g')
    
    # Create the .md file
    cat > "$md_file" << EOF
## $title
\`\`\`mermaid
$content
\`\`\`
EOF
    
    # Add to summary
    relative_md_path=${md_file#sa/docs/}
    echo "- [$title]($relative_md_path)" >> sa/docs/SUMMARY.md
    
    echo "Converted: $mmd_file -> $md_file"
done

echo "Conversion completed!"
echo "Summary created: sa/docs/SUMMARY.md"
