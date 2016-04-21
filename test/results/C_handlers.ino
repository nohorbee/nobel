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

