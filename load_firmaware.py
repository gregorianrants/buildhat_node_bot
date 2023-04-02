from buildhat.motors import Motor
import time

left = Motor('C')
right = Motor('D')

time.sleep(30)
print('frimaware loaded')

left.stop()
right.stop()