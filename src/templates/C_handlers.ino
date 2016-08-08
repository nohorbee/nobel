// Handlers
{% for resource in resources %}void {{ resource.relativeUriPathSegments[0] }}Handler(WebServer &server, WebServer::ConnectionType verb, String uriParams, String queryParams);
void {{ resource.relativeUriPathSegments[0] }}Handler(WebServer &server, WebServer::ConnectionType verb, String uriParams, String queryParams) {
  switch (verb)
    {
    {% for method in resource.methods %}case WebServer::{{ method.method|upper }}:
        server.httpSuccess();
        break;
    {% endfor %}
    default:
        server.httpFail();
    }
}
{% endfor %}