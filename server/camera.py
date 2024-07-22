import cv2
import http.server
import socketserver
import threading

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
                            break

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
                    self.server.server_close()  # Close server on exception
                    print('Exception:', e)
                    pass
        else:
            self.send_error(404)
            self.end_headers()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    pass

def main():
    # IMPORTANT!!! Feel free to add ip address that is yours. make sure to comment out (not delete) the others so that you can run it

    ip = "10.147.18.228"
    # dhruv mac ip (home)
    # ip = "192.168.1.160"
    port = 9000
    address = (ip, port)  # Use an empty string for the host to listen on all available interfaces
    server = ThreadedHTTPServer(address, StreamProps)

    # Set up the stream properties
    capture = cv2.VideoCapture(0)
    capture.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    capture.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    capture.set(cv2.CAP_PROP_FPS, 1)
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
        capture.release()
        server.server_close()
if __name__ == "__main__":
    main()