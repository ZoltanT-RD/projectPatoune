## to run frontend through the backend

* -> webpack-watch (devserver WONT WORK) / slower
* -> backend-server

access it through the `WEBSERVER_BASEURL` and `WEBSERVER_PORT`

### when using this method, note:

* webpagepage needs manual refreshing
* after new frontend-build, backend server needs restarting _(if running with "backendserver" script, just change a file and save it; this will trigger a restart)_


## to run frontend and backend independently _(this will only work till GoogleSignIn)_

* -> webpack-devserver
* -> backend-server
