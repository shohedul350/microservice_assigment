Few dependencies:
 * Node.js
 * RabbitMQ
 * Mongodb

Prerequisites
-----

I assume you have installed Docker and it is running.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

Build
-----

Steps to build a Docker image:

1. Clone this repo

        git clone https://github.com/shohedul350/microservice_assignment.git


2. Build the image

        cd microservice_assignment
        docker-compose build  

    This will take a few minutes

4. Run the docker Image

        docker-compose up

     This will take a few minutes
3. Once everything has started up, you should be able to access the api  on your host machine.

See the [API Document](https://documenter.getpostman.com/view/12926852/Uyr5myPQ)
    
