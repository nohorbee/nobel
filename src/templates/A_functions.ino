const byte SIZE_RESOURCES = {{ resources.length }}; // constant until resolve what's going on with sizeof
Handler handlers[SIZE_RESOURCES];
void parseTail(char* tail, String &url, String &queryParams) {
  String tailToTokenize(tail);
  String sUrl = "";
  String sQueryParams = "";
  if(tailToTokenize.indexOf("?")>-1) {
    url = tailToTokenize.substring(0,tailToTokenize.indexOf("?")) + "/";
    queryParams = tailToTokenize.substring(tailToTokenize.indexOf("?")+1);
  } else {
    url = tailToTokenize + "/";
  }
}


void dispatch(WebServer &server, WebServer::ConnectionType verb, char url_tail[], bool tail_complete) {
  Serial.println();
  Serial << F("Available RAM on dispatch start is: ") << availableMemory() << "\r\n";
  
  // THIS ARRAY CAN'T BE GENERATED GLOBAL, OR PASSED AS A PARAMETER (since the function is a Command). So,
  // The code generator must inject this here (I haven' found a nicer way to do this).
  FLASH_STRING_ARRAY(resources,{% for resource in resources %}
      PSTR("/{{ resource.relativeUriPathSegments[0] }}/"),{% endfor %}
  );
  
  
  String url;
  String queryParams;
  parseTail(url_tail, url, queryParams); 
  Serial.print(F("URL: "));
  Serial.println(url);
  Serial.print(F("QueryParams: "));
  Serial.println(queryParams);
  Serial << F("Available RAM AFTER GETTING URL and PARAMS is: ") << availableMemory() << "\r\n";
  byte foundURIPosition = lookUp(url , resources);
  Serial << F("AFTER LOOKUP - Available RAM is: ") << availableMemory() << "\r\n";
  String uriParams = getUriParameters(url, resources[foundURIPosition]);
  Serial << F("AFTER PARSINGURIPARAMS - Available RAM is: ") << availableMemory() << "\r\n";
  // call function
  Serial << F("Available RAM is: ") << availableMemory() << "\r\n";
  
  Serial.print("Let' dispatch to: ");
  resources[foundURIPosition].print(Serial);
  Serial.print(" with query Params: ");
  Serial.print(queryParams);
  Serial.print(" and with uri Params: ");
  Serial.println(uriParams);
  
  if (foundURIPosition>-1) {
    handlers[foundURIPosition].method(server, verb, uriParams, queryParams);
  }


    
  
}




String getParameter(String params, String paramName) {
  
  paramName = paramName + "=";
  
  int starting = params.indexOf(paramName);
  int ending = params.indexOf("&", starting);
  if (starting>-1) {
    if (ending>-1) {
      return (params.substring(starting+paramName.length(), ending));
    } else {
            return (params.substring(starting+paramName.length()));        
    }
  }

  return "";
  
}


String getUriParameters(String url, _FLASH_STRING furi) {
  const bool LOOKUP_VERBOSE = false;
  String params="";
  
    String uri = strcpy_P(furi);
    if (LOOKUP_VERBOSE) { Serial.print("Analyzing URI"); Serial.println(uri); }
    if (LOOKUP_VERBOSE) { Serial.print("for URL"); Serial.println(url); }
    
    
    int urlLastPos = 0;
    int uriLastPos = 0;
    int urlPos = url.indexOf("/");
    int uriPos = uri.indexOf("/");

    while((uriPos >-1 || urlPos >-1)) {
      String urlTok = url.substring(urlLastPos+1, urlPos);
      String uriTok = uri.substring(uriLastPos+1, uriPos);
      if (LOOKUP_VERBOSE) { Serial.print("COMPARING PART: "); Serial.print(uriTok); Serial.print(" = "); Serial.println(urlTok);}
      
      
      if (!urlTok.equals(uriTok)) {
        if(checkWildcard(uriTok)) {
          if (params.length()>0) params += "&";
          params += getCouple(uriTok, urlTok);
        }
      }
      
      
      
      urlLastPos = urlPos;
      uriLastPos = uriPos;
      urlPos = url.indexOf("/", urlLastPos+1);
      uriPos = uri.indexOf("/", uriLastPos+1);
    }    
    return params;
}


String getCouple(String uriTok, String urlTok) {
  return (uriTok.substring(2, uriTok.length()-1) + "=" + urlTok);
}
//
bool checkWildcard(String toCheck) {
  if(!(toCheck.length()>0)) { return false; }// empty string is not a wildcard 
  return (toCheck[0]=='{'  && toCheck[1]==':' && toCheck[toCheck.length()-1]=='}');
}
//
int lookUp(String url, _FLASH_STRING_ARRAY resources) {
  const bool LOOKUP_VERBOSE = false;
  int i=0;
  int foundPosition = -1;
  byte prevWildcardsCount = 255;
  for(i;i<resources.count();i++) {
    String uri = strcpy_P(resources[i]);
    if (LOOKUP_VERBOSE) { Serial.print("Analyzing URI"); Serial.println(uri); }
    if (LOOKUP_VERBOSE) { Serial.print("for URL"); Serial.println(url); }
    
    byte wildcardsCount = 0;
    int urlLastPos = 0;
    int uriLastPos = 0;
    int urlPos = url.indexOf("/");
    int uriPos = uri.indexOf("/");
    bool match = true;
    while((uriPos >-1 || urlPos >-1) && match) {
      String urlTok = url.substring(urlLastPos+1, urlPos);
      String uriTok = uri.substring(uriLastPos+1, uriPos);
      if (LOOKUP_VERBOSE) { Serial.print("COMPARING PART: "); Serial.print(uriTok); Serial.print(" = "); Serial.println(urlTok);}
      if (!urlTok.equals(uriTok)) {
        if(checkWildcard(uriTok)) {
         if (LOOKUP_VERBOSE) { Serial.println("SAVING WITH WILDCARD");  }
          wildcardsCount++;
        } else {
          if (LOOKUP_VERBOSE) { Serial.println("LOOSING MATCH");  }
          match=false;
        }
      }
      urlLastPos = urlPos;
      uriLastPos = uriPos;
      urlPos = url.indexOf("/", urlLastPos+1);
      uriPos = uri.indexOf("/", uriLastPos+1);
    }
    
    if(match) {
        if (LOOKUP_VERBOSE) { Serial.print(F("MATCHED WITH WILDCARDS COUNT: ")); Serial.println(wildcardsCount); }
        if(wildcardsCount<prevWildcardsCount) {
          prevWildcardsCount = wildcardsCount;
          foundPosition = i;
        }
      }
    
   }
  if (LOOKUP_VERBOSE) { 
    if (foundPosition > -1) {
      Serial.print(F("SELECTED: ")); resources[foundPosition].print(Serial);
    } else {
      Serial.println(F("No match found"));
    }
  }
  return foundPosition;
}
 
 
 
String getPostParameter(WebServer server, char paramName[16]) {
  
    bool repeat;
    char name[16], value[16];
    String foundValue;
    do
    {
      /* readPOSTparam returns false when there are no more parameters
       * to read from the input.  We pass in buffers for it to store
       * the name and value strings along with the length of those
       * buffers. */
      repeat = server.readPOSTparam(name, 16, value, 16);

      /* this is a standard string comparison function.  It returns 0
       * when there's an exact match.  We're looking for a parameter
       * named "buzz" here. */
      if (strcmp(name, paramName) == 0)
      {
	/* use the STRing TO Unsigned Long function to turn the string
	 * version of the delay number into our integer buzzDelay
	 * variable */
        foundValue = value;
      }
    } while (repeat);
    return foundValue;
}


int availableMemory() 
{
  int size = 1024;
  byte *buf;
  while ((buf = (byte *) malloc(--size)) == NULL);
  free(buf);
  return size;
}

String strcpy_P(_FLASH_STRING stack) {
  String copy = "";
  for (int i=0;i<stack.length();i++) {
    copy += stack[i];
  }
  return copy;

}

