import cv2, os
import numpy as np
from PIL import Image
import requests
import json
import sys

url = "http://localhost:3000/match"

cascadePath = "face.xml"
faceCascade = cv2.CascadeClassifier(cascadePath)
picture = sys.argv[1]

recognizer = cv2.createLBPHFaceRecognizer()

def get_images_and_labels(path):
    image_paths = [os.path.join(path, f) for f in os.listdir(path)]
    images = []
    labels = []
    for image_path in image_paths:
        image_pil = Image.open(image_path).convert('L')
        image = np.array(image_pil, 'uint8')
        nbr = int(os.path.split(image_path)[1].split(".")[0])
        faces = faceCascade.detectMultiScale(image)
        for (x, y, w, h) in faces:
            images.append(image[y: y + h, x: x + w])
            labels.append(nbr)
    return images, labels

path = 'pictures/'

images, labels = get_images_and_labels(path)

recognizer.train(images, np.array(labels))

image_pil = Image.open(picture).convert('L')
image = np.array(image_pil, 'uint8')
faces = faceCascade.detectMultiScale(image)
nbr = ""
for(x,y,w,h) in faces:
    nbr = recognizer.predict(image[y: y + h, x: x + w])
    nbr = "pictures/" + str(nbr[0]) + ".jpg"
    break

print nbr

if nbr:
    # request number
    r = requests.post(url,json={"match": nbr})
else:
    # request number = 0
    r = requests.post(url,json={"match": "nothing"})
# miguel - 2 - 5
# me - 1, 6 - end

# mongo update
'''

db.users.update({"_id" : ObjectId("56f6b6d56e401f4010071db8")}, {"pictures": ["pictures/1.jpg", "pictures/6.jpg", "pictures/7.jpg", "pictures/8.jpg", "pictures/9.jpg", "pictures/10.jpg", "pictures/11.jpg"], "name": "Devin", "fb": "", "tw": "devinwmui"})

db.users.update({"_id": ObjectId("56f70267d4f6728118e30d26")}, {"pictures": ["pictures/2.jpg", "pictures/3.jpg", "pictures/4.jpg", "pictures/5.jpg"], "name": "Miguel", "tw": "pandawanyt", "fb": ""})


'''