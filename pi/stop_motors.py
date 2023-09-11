from buildhat.motors import Motor
import time

left = Motor('C')
right = Motor('D')


left.stop()
right.stop()
print('motors should be stopped now by python script')