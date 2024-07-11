#!/bin/bash

CONFIG_FILE="$HOME/.raspi_transfer_config"

use_saved_settings() {
    if [[ -f "$CONFIG_FILE" ]]; then
        source "$CONFIG_FILE"
        echo "Using saved settings:"
        echo "File: $PYTHON_FILE"
        echo "Raspberry Pi User: $PI_USER"
        echo "Raspberry Pi Host: $PI_HOST"
        echo "Destination Path: $PI_PATH"
        return 0
    else
        return 1
    fi
}

save_settings() {
    echo "PYTHON_FILE=\"$PYTHON_FILE\"" > "$CONFIG_FILE"
    echo "PI_USER=\"$PI_USER\"" >> "$CONFIG_FILE"
    echo "PI_HOST=\"$PI_HOST\"" >> "$CONFIG_FILE"
    echo "PI_PATH=\"$PI_PATH\"" >> "$CONFIG_FILE"
}

if use_saved_settings; then
    read -p "Do you want to use the saved settings? (y/n): " use_saved
else
    use_saved="n"
fi

if [[ "$use_saved" != "y" ]]; then
    # Prompt the user for the Python file to transfer
    read -p "Enter the name of the Python file to transfer: " PYTHON_FILE

    # Prompt the user for Raspberry Pi details
    read -p "Enter the Raspberry Pi user: " PI_USER
    read -p "Enter the Raspberry Pi host: " PI_HOST
    read -p "Enter the destination path on the Raspberry Pi: " PI_PATH

    # Save the settings for future use
    save_settings
fi

# Extract the filename from the provided path
FILENAME=$(basename "$PYTHON_FILE")

# Check if the file exists
if [[ ! -f "$PYTHON_FILE" ]]; then
    echo "File not found: $PYTHON_FILE"
    exit 1
fi

# Transfer the Python file to the Raspberry Pi
scp "$PYTHON_FILE" "$PI_USER@$PI_HOST:$PI_PATH"

echo "File transferred successfully to $PI_HOST:$PI_PATH/$FILENAME"
