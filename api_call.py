import httplib
import urllib
import base64

headers = {
    # Request headers
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': '3a018b4f8aa24c87847653c6b6128f43',
}

params = urllib.urlencode({
})

body = "{ 'url': 'https://i.pinimg.com/originals/24/63/65/246365c4e7bd4439382590ef4a149e63.jpg' }"


def image_2_emotion(threshold):
    try:
        conn = httplib.HTTPSConnection('westus.api.cognitive.microsoft.com')
        # conn.request("POST", "/emotion/v1.0/recognize?faceRectangles={faceRectangles}&%s" % params, body, headers)
        conn.request("POST", "/emotion/v1.0/recognize?%s" % params, body, headers)
        response = conn.getresponse()
        data = response.read()
        happiness = float(data.split('"scores"')[-1].split('"happiness"')[-1].split(':')[1].split(',')[0])

        if happiness >= threshold:
            print('is happy: %f' % happiness)
        else:
            print('is not happy: %f' % happiness)

        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))


image_2_emotion(0.7)
