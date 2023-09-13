import cv2
import numpy as np


def getBottomOfUpperEdge(pixels):
    closest = np.argmax(pixels, axis=0)
    closest = pixels.shape[0] - closest.max()
    return closest


def split(img):
    middleIndex = img.shape[1] // 2
    left = img[:, :middleIndex]
    left = left[:, 15:]  ##slice side of incase some of it is outside contour
    right = img[:, middleIndex:]
    right = right[:, :-15]
    return (left, right)


def flood(original_image, lower_margin=(8, 2, 2), upper_margin=(14, 2, 2)):
    image = cv2.cvtColor(original_image, cv2.COLOR_BGR2HSV)
    image = cv2.bilateralFilter(image, 9, 75, 75)
    (height, width) = image.shape[:2]
    (seedY, seedX) = (height - 5, width // 2)
    sample = image[seedY - 20 : seedY + 20, seedX - 20 : seedX + 20].copy()

    sample = cv2.GaussianBlur(sample, (11, 11), 0)
    image[seedY - 20 : seedY + 20, seedX - 20 : seedX + 20] = sample

    mask = np.zeros((height + 2, width + 2), "uint8")

    floodflags = 8
    floodflags |= cv2.FLOODFILL_MASK_ONLY
    floodflags |= 255 << 8

    (retval, image, _, rect) = cv2.floodFill(
        image, mask, (seedX, seedY), 255, lower_margin, upper_margin, floodflags
    )
    # mask = mask[:-1,:-1]
    mask = mask[1:-1, 1:-1]
    (cnts, _) = cv2.findContours(
        mask.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
    )

    # print(mask.shape)

    colored_mask = np.zeros((*mask.shape, 3), dtype="uint8")
    colored_mask[mask == 255] = [0, 125, 0]

    eps = 0.025

    approx = cv2.convexHull(cnts[0])

    # could do this with geometry rather than pixels using sympy, would it make a difference?
    pixelPoints = cv2.drawContours(np.zeros((height, width)), [approx], 0, 255, -1)
    left, right = split(pixelPoints)
    left_closest = getBottomOfUpperEdge(left).astype(float)
    right_closest = getBottomOfUpperEdge(right).astype(float)

    cv2.drawContours(original_image, [approx], -1, (0, 255, 0), 2)
    original_image = cv2.addWeighted(original_image, 0.9, colored_mask, 0.5, 0.3)
    return [original_image, left_closest, right_closest]
