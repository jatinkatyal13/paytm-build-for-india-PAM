# Proof-of-concept
import cv2
import base64
import sys
from .constants import *
from .emotion_recognition import EmotionRecognition
import numpy as np
from collections import OrderedDict

cascade_classifier = cv2.CascadeClassifier(CASC_PATH)

def brighten(data,b):
     datab = data * b
     return datab    

def format_image(image):
  if len(image.shape) > 2 and image.shape[2] == 3:
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
  else:
    image = cv2.imdecode(image, cv2.CV_LOAD_IMAGE_GRAYSCALE)
  faces = cascade_classifier.detectMultiScale(
      image,
      scaleFactor = 1.3,
      minNeighbors = 5
  )
  # None is we don't found an image
  if not len(faces) > 0:
    return None
  max_area_face = faces[0]
  for face in faces:
    if face[2] * face[3] > max_area_face[2] * max_area_face[3]:
      max_area_face = face
  # Chop image to face
  face = max_area_face
  image = image[face[1]:(face[1] + face[2]), face[0]:(face[0] + face[3])]
  # Resize image to network size
  try:
    image = cv2.resize(image, (SIZE_FACE, SIZE_FACE), interpolation = cv2.INTER_CUBIC) / 255.
  except Exception:
    print("[+] Problem during resize")
    return None
  # cv2.imshow("Lol", image)
  # cv2.waitKey(0)
  return image

def data_uri_to_cv2_img(uri):
  encoded_data = uri.split(',')[1]
  nparr = np.fromstring(base64.b64decode(encoded_data), np.uint8)
  img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
  return img

# Load Model
network = EmotionRecognition()
network.build_network()

def predict_face(b):
  img = data_uri_to_cv2_img(b)
  d = OrderedDict()
  res = network.predict(format_image(img)).tolist()[0]

  for i in range(len(res)):
    d[EMOTIONS[i]] = res[i]
  return d
