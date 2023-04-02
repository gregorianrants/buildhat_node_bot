# buildhat-node-bot
this is a library that uses the buildhat for raspberry pi to contorl motors on a differential drive robot.

# important notes
the codebase is a first proof of concept that i have published for anyone that wants to follow what i am doing.  fi you want to use it you probably need to figure out what the code does and modify it.
when the build hat turns on it does not have the firmaware on it so you need to run the npm-script load-firmaware (requires python) to load this before running other scripts.
there are paramters specific to my robot in this code, they are not all grouped in an obvious place.
this is code that is being experimented with and developed at the same time

it uses the serialprotocol for the buildhat via nodejs rather than the python library

# how can i use this
there are scripts in package.json that runs what it can do so far.

#what can it do so far
contorl motors 
emit motor tacho info as events
contorl speed of motors using pid
control translational and rotational speed of robot.

# why am i building this

1. the speed control via the python library is not fit for purpoose there is a delay between the motors start whcih just makes it spin round
2. the python library uses threads to achieve concurrency, i wanted to use event loop style asynchronous programming, 

# why i chose nodejs

i started with using asyncio in python but i am more familiar with nodejs and found it much easier to achieve what i wanted with it.  
In particular several parts of my codebase will have to react to the same events, the nodejs event emitter makes this easy.
I found that i could do some things with node in one declarative line that took many hard to follow lines of garbled code in python.
e.g. reading from the serial port.

# where am i going with this
i am actively dveloping this and it will change frequently
i will add more info here soon about what the code does and where i am going with it.