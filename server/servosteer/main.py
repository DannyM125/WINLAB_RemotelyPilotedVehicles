import threading
import server
import camera
# import signal
# import sys

# These threads are independent... so they don't have to await each other or anything...
g1 = threading.Thread(target=server.main)
g2 = threading.Thread(target=camera.main)
g1.start()
g2.start()
# sys.exit(0)