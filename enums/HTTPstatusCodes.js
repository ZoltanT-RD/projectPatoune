// https://www.restapitutorial.com/httpstatuscodes.html

// this list is incomplete, add new ones as required
const HTTPstatusCodes = {
  _200_ok: 200, //Standard response for successful HTTP requests
  _201_created: 201, //The request has been fulfilled, resulting in the creation of a new resource
  _202_accepted: 202, //The request has been accepted for processing, but the processing has not been completed.
  _204_noContent: 204, //The server successfully processed the request and is not returning any content
  _301_permanentlyMoved: 301, //The requested resource has been assigned a new permanent URI and any future references to this resource SHOULD use one of the returned URIs
  _307_tempRedirect: 307, //The requested resource resides temporarily under a different URI. Since the redirection MAY be altered on occasion, the client SHOULD continue to use the Request-URI for future requests.
  _308_permanentRedirect: 308, //The request, and all future requests should be repeated using another URI.
  _318_intendedRedirect: 318, //I've added this...
  _400_badRequest: 400, //The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing)
  _401_unauthorised: 401, //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
  _403_forbidden: 403, //The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.
  _404_notFound: 404, //The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
  _405_methodNotAllowed: 405, //A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
  _406_notAcceptable: 406, //The resource identified by the request is only capable of generating response entities which have content characteristics not acceptable according to the accept headers sent in the request.
  _408_requestTimeout: 408, //The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.
  _409_conflict: 409, //The request could not be completed due to a conflict with the current state of the resource. This code is only allowed in situations where it is expected that the user might be able to resolve the conflict and resubmit the request. The response body SHOULD include enough information for the user to recognize the source of the conflict.
  _418_ImATeapot: 418, //This code was defined in 1998 as one of the traditional IETF April Fools' jokes,
  _500_internalServerError: 500, //A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
  _501_notImplemented: 501, //The server does not support the functionality required to fulfill the request. This is the appropriate response when the server does not recognize the request method and is not capable of supporting it for any resource.
  _503_serviceUnavailable: 503, //The server is currently unable to handle the request due to a temporary overloading or maintenance of the server.
};

module.exports = HTTPstatusCodes;