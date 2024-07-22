import subprocess

# FFmpeg command to capture and stream video on macOS
ffmpeg_cmd = [
    'ffmpeg',
    '-f', 'avfoundation',   # Input format for macOS
    '-framerate', '30',
    '-video_device_index', '0',  # Device index for the webcam (0 usually means the default webcam)
    '-i', '0',               # Input device (0 is usually the default webcam on macOS)
    '-pix_fmt', 'yuv420p',  # Use a more standard pixel format
    '-b:v', '2M',  # Set bitrate (adjust as needed)
    '-c:v', 'libx264',       # Codec
    '-preset', 'ultrafast',  # Ultra-fast encoding
    '-tune', 'zerolatency',  # Low latency mode
    '-f', 'mpegts',          # MPEG-TS format
    'udp://127.0.0.1:5001'   # Output address
]

# Start FFmpeg process
process = subprocess.Popen(ffmpeg_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

try:
    # Print standard error output to check for errors
    for line in iter(process.stderr.readline, b''):
        print(line.decode().strip())
except KeyboardInterrupt:
    process.terminate()
    print("Process terminated by user.")
finally:
    process.wait()  # Ensure the process exits properly
