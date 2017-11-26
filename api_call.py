import httplib
import urllib
import os
import cv2
import scipy.misc


headers = {
    # Request headers
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': '3a018b4f8aa24c87847653c6b6128f43',
}

params = urllib.urlencode({
})


def image_2_emotion(threshold, body):
    try:
        conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
        # conn.request("POST", "/emotion/v1.0/recognize?faceRectangles={faceRectangles}&%s" % params, body, headers)
        conn.request("POST", "/emotion/v1.0/recognize?%s" % params, body, headers)
        response = conn.getresponse()
        data = response.read()
        print(data)
        happiness = float(data.split('"scores"')[-1].split('"happiness"')[-1].split(':')[1].split(',')[0])

        if happiness >= threshold:
            print('is happy: %f' % happiness)
        else:
            print('is not happy: %f' % happiness)

        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))


def test_api_with_webcam():
    cap = cv2.VideoCapture(0)
    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()

        # Our operations on the frame come here
        # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # save image
        scipy.misc.imsave('outfile.jpg', frame)

        with open("outfile.jpg", "rb") as imageFile:
            f = imageFile.read()
            b = bytearray(f)

        body = b

        # get_face(frame, gray)
        image_2_emotion(0.7, body)

        # Display the resulting frame
        cv2.imshow('frame', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()

test_api_with_webcam()