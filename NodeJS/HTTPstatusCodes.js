/**
 * @author Zoltan Tompa
 * @email zoltan@resdiary.com
 * @create date 2019-01-04 14:00:09
 * @modify date 2019-01-04 14:00:09
 * @desc [description]
 */


const HTTPstatusCodes = {
    ok: 200, //Standard response for successful HTTP requests
    created: 201, //The request has been fulfilled, resulting in the creation of a new resource
    accepted: 202, //The request has been accepted for processing, but the processing has not been completed.
    noContent: 204, //The server successfully processed the request and is not returning any content
    badRequest: 400, //The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing, or deceptive request routing)
    unauthorised: 401, //Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource.
    forbidden: 403, //The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource, or may need an account of some sort.
    notFound: 404, //The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.
    methodNotAllowed: 405, //A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST, or a PUT request on a read-only resource.
    ImATeapot: 418, //This code was defined in 1998 as one of the traditional IETF April Fools' jokes,
    InternalServerError: 500 //A generic error message, given when an unexpected condition was encountered and no more specific message is suitable
  };

module.exports = HTTPstatusCodes;