import cv2
import numpy
import requests
import sys

face_cascade = cv2.CascadeClassifier('face.xml')

picture = sys.argv[1] # path

img = cv2.imread(picture)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)

for (x,y,w,h) in faces: # eigenfaces one of them
    cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)

cv2.imshow('img',img)
cv2.waitKey(0)
cv2.destroyAllWindows()