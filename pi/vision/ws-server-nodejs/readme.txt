this isnt used at the moment
i decided to go in a different direction for the camera
it runs the c command line app launches it in a process and then sends the data stream over websockets
i had to restich the bytes that are emitted back into jpegs i am guessing when i do this myself it is probably inefficient and have 
opted to use the picamera library that gives me complete jpegs.
it uses the new libcamera which needs enabled in settings
i have left it here becuase it may be informative tin the future if i change direction again.
probably if i use libcamera i will use the python library and see if i can figure out how to get jpegs
i dont understand the docs for it at the moment.