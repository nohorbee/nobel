nobel
=====

Nobel (code-generator) creates a REST API for your [Arduino](http://arduino.cc/) board, based on a [RAML](http://raml.org) definition.

##Description

Nobel scaffolds an Arduino application that exposes a REST API.
Then, you will write the logic for interacting with your physical devices inside methods that will be executed when the corresponding URL is invoked.

### Example

Considering the following RAML code:

```yaml
#%RAML 0.8
title: NobelTestingAPI
/servo:
  post:
    description: |
      Moves the servo to the specified angle.
    body:
      application/json:
        example: |
          {"angle": 71}
  put:
    description: |
      Moves the servo buy Adding the specified angle (could be negative)
    body:
      application/json:
        example: |
          {"angle": -10}
  get:
    description: |
      Returns the current servo angle
    responses:
      200:
        body:
          application/json:
            example: |
              { "angle": 71 }

```

Nobel will generate a project with several files (following the Arduino specs for splitting a program). One of the files will contain the *Handlers*, where
you will be able to write your own code. Associated to the RAML example:

```c
// Handlers

void servoHandler(WebServer &server, WebServer::ConnectionType verb, String uriParams, String queryParams) {
  switch (verb)
    {

    case WebServer::POST:
        server.httpSuccess();
        break;

    case WebServer::PUT:
        server.httpSuccess();
        break;

    case WebServer::GET:
        server.httpSuccess();
        break;

    default:
        server.httpFail();
    }
}

```
