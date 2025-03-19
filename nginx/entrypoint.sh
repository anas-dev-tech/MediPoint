#!/bin/bash

# List of enabled sites (modify this to enable/disable sites)
ENABLED_SITES=("backend.conf" "redirect.conf")

# Ensure the sites-enabled directory is empty (to avoid duplicate links)
rm -rf /etc/nginx/sites-enabled/*

# Loop through the enabled sites array
for site in "${ENABLED_SITES[@]}"; do
    src="/etc/nginx/sites-available/$site"
    dest="/etc/nginx/sites-enabled/$site"
    
    if [ -f "$src" ]; then
        ln -s "$src" "$dest"
        echo "Enabled $site"
    else
        echo "Warning: $site not found in sites-available"
    fi
done


nginx -g "daemon off;"