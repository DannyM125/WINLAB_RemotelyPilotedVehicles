import cv2
import http.server
import socketserver
import threading
from colorama import Fore, Style, Back
import sys
import variables
class StreamProps(http.server.BaseHTTPRequestHandler):
    # non static methods
    @classmethod
    def set_Capture(cls, capture):
        cls.capture = capture

    @classmethod
    def set_Quality(cls, quality):
        cls.quality = quality

    @classmethod
    def set_Mode(cls, mode):
        cls.mode = mode

    def do_GET(self):
        # if someone requests the /stream.mjpg
        if self.path == '/stream.mjpg':
            # send these headers:
            self.send_response(200)

            # shows age of object
            self.send_header('Age', 0)

            # can't use cache to fulfill subsequent requests (without revalidation), private = meant for one user and no proxies allowed to store it
            self.send_header('Cache-Control', 'no-cache, private')

            # Backwards compatibility
            self.send_header('Pragma', 'no-cache')

            # multipart/x-mixed-replace means the contents of documents can be replaced, used for live video streaming (like us)
            self.send_header('Content-Type', 'multipart/x-mixed-replace; boundary=FRAME')
            self.end_headers()

            if self.mode == 'cv2':
                try:
                    while True:
                        rc, img = self.capture.read()
                        if not rc:
                            pass
                            # raise Exception("Cam Disconnect")

                        frame = cv2.imencode('.JPEG', img, [cv2.IMWRITE_JPEG_QUALITY, self.quality])[1].tobytes()

                        self.wfile.write(b'--FRAME\r\n')
                        self.send_header('Content-Type', 'image/jpeg')
                        self.send_header('Content-Length', len(frame))
                        self.end_headers()
                        self.wfile.write(frame)
                        self.wfile.write(b'\r\n')

                        # Flush output to send the frame immediately
                        self.wfile.flush()
                except Exception as e:
                    # self.server.server_close()  # Close server on exception
                    print(Fore.RED + Back.WHITE + f'Exception: {e}. Cam or client likely disconnected.' + Style.RESET_ALL)
                    self.send_response(500)
                    self.send_header('Content-Type', 'text/plain')
                    self.end_header()
                    self.wfile.write("Internal server error, camera failed")
                    print(Fore.WHITE + Back.RED + Style.BRIGHT + "FATAL ERROR: Camera closed" + Style.RESET_ALL)

        else:
            self.send_error(404)
            self.end_headers()

# inherited, I don't want to figure this out
class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

def main():
    # IMPORTANT!!! Feel free to add ip address that is yours. make sure to comment out (not delete) the others so that you can run it
    capture = cv2.VideoCapture(0)
    if not capture.isOpened():
        print(Fore.WHITE + Back.RED + Style.BRIGHT + "FATAL ERROR: Camera isn't opening... please check camera settings" + Style.RESET_ALL)
        print(Style.RESET_ALL)
        sys.exit()
    # ip = "10.147.18.228"
    # dhruv mac ip (home)
    # ip = "192.168.1.160"
    #dhruv mac winlab
    ip = variables.IP_SERVER_ZT
    #winmain ip addr
    # ip = "10.61.1.102"
    port = variables.PORT
    address = (ip, port)  # Use an empty string for the host to listen on all available interfaces
    try:
        server = ThreadedHTTPServer(address, StreamProps)
    except OSError as err:
        print(Fore.WHITE + Back.RED + Style.BRIGHT + f"{err}: Make sure the IP address is correct and you are on an open port" + Style.RESET_ALL)
        sys.exit()

    # Set up the stream properties
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    capture.set(cv2.CAP_PROP_FPS, 5)
    StreamProps.set_Capture(capture)
    StreamProps.set_Quality(90)
    StreamProps.set_Mode('cv2')

    try:
        print(f'Server started at http://{ip}:{port}/stream.mjpg')
        server_thread = threading.Thread(target=server.serve_forever)
        server_thread.daemon = True
        server_thread.start()
        server_thread.join()
    except KeyboardInterrupt:
        print("Taking down server")
        capture.release()
        server.server_close()
if __name__ == "__main__":
    main()