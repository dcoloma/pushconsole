var endpoint = null;
var version = 1;

window.addEventListener('load', init);

function init()
{
  document.getElementById("unregister").style.visibility="hidden";
  document.getElementById("unregister").style.display="none";
  document.getElementById("send").style.visibility="hidden";
  document.getElementById("send").style.display="none";

  document.getElementById("create").addEventListener('click', createEndpoint);
  document.getElementById("unregister").addEventListener('click',unregister);
  document.getElementById("send").addEventListener('click',send);

  endpoint = localStorage.getItem("endpoint"); // Check if we have an endpoint in LS

  if ((endpoint !== null) && (endpoint !== "null")) {
    version = localStorage.getItem("version");
    if (version == null)
      version = 1;
    document.getElementById("endpoint").innerHTML = endpoint;
    document.getElementById("status").innerHTML = "Endpoint Recovered Successfully from Local Storage";
    document.getElementById("create").style.visibility="hidden";
    document.getElementById("create").style.display="none";
    document.getElementById("unregister").style.visibility="visible";
    document.getElementById("unregister").style.display="inline-block";
    document.getElementById("send").style.visibility="visible";
    document.getElementById("send").style.display="inline-block";
  }
  else {
    document.getElementById("status").innerHTML = "No Previous Endpoint available";
  }
}

function registerEndpoint()
{
  var req = navigator.push.register();
  document.getElementById("status").innerHTML = "Creating Endpoint";
  
  req.onsuccess = function(e) {
    endpoint = req.result;
    localStorage.setItem("endpoint",endpoint);
    localStorage.setItem("version", 1);
    document.getElementById("endpoint").innerHTML = endpoint;
    document.getElementById("status").innerHTML += "<br/>Endpoint Created Successfully";
    document.getElementById("create").style.visibility="hidden";
    document.getElementById("create").style.display="none";
    document.getElementById("unregister").style.visibility="visible";
    document.getElementById("unregister").style.display="inline-block";
          document.getElementById("send").style.visibility="visible";
      document.getElementById("send").style.display="inline-block";
  }
  req.onerror = function(e) {
    document.getElementById("status").innerHTML += "<br/>Endpoint not created " + JSON.stringify(e);
  }
}

function createEndpoint()
{
  if (navigator.push) {
    var req = navigator.push.register();
    document.getElementById("status").innerHTML = "Creating Endpoint";
  
    req.onsuccess = function(e) {
      endpoint = req.result;
      localStorage.setItem("endpoint",endpoint);
      localStorage.setItem("version", 1);
      document.getElementById("endpoint").innerHTML = endpoint;
      document.getElementById("status").innerHTML += "<br/>Endpoint Created Successfully";
      document.getElementById("create").style.visibility="hidden";
      document.getElementById("create").style.display="none";
      document.getElementById("unregister").style.visibility="visible";
      document.getElementById("unregister").style.display="inline-block";
      document.getElementById("send").style.visibility="visible";
      document.getElementById("send").style.display="inline-block";
    }
    req.onerror = function(e) {
      document.getElementById("status").innerHTML += "<br/>Endpoint not created " + JSON.stringify(e);
    }  
  }
  else {
    document.getElementById("status").innerHTML = "Push not available in this Firefox Version";
  }
}

function unregister(){
  document.getElementById("status").innerHTML = "Unregistering Endpoint ";
  if ((endpoint !== null) && (endpoint !== "null")) {
    var req = navigator.push.unregister(endpoint);

    req.onsuccess = function(e) {
      var endpoint = req.result;
      document.getElementById("status").innerHTML +="<br/>Endpoint unregistered successfully";
      document.getElementById("endpoint").innerHTML = "No Endpoint";
      document.getElementById("create").style.visibility="visible";
      document.getElementById("create").style.display="inline-block";
      document.getElementById("unregister").style.visibility="hidden";
      document.getElementById("unregister").style.display="none";
      document.getElementById("send").style.visibility="hidden";
      document.getElementById("send").style.display="none";
      endpoint = null;
      version = 1;
      localStorage.setItem("endpoint",endpoint);
      localStorage.setItem("version", version);
    }
    req.onerror = function(e) {
      document.getElementById("status").innerHTML += "<br/>Error unregistering the endpoint: " + JSON.stringify(e);
    }
  }
  else {
    document.getElementById("status").innerHTML +="<br/>No endpoint registered, cannot unregister";
  }
}

function send() {
  if ((endpoint !== null) && (endpoint !== "null"))  {
    document.getElementById("status").innerHTML = "Sending Push (version " + version +")";
    var xhr = new XMLHttpRequest({
    })

    xhr.open("PUT", endpoint, true);
    var params = "version=" + version;
    version++;
    localStorage.setItem("version",version);

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Content-length", params.length);
    xhr.setRequestHeader("Connection", "close");

    xhr.onreadystatechange = function() {//Call a function when the state changes.
      if(xhr.readyState == 4 && xhr.status == 200) {
        console.log("push sent");
      }
    }
    xhr.send(params);
  }
}

// For managing incoming Push Notifications and re-registers
if (window.navigator.mozSetMessageHandler) {
  window.navigator.mozSetMessageHandler('push-register', function(e) {
    document.getElementById("status").innerHTML = "Push-register received, re-registering endpoint again!";

    var req = navigator.push.register();
    req.onsuccess = function(e) {
      endpoint = req.result;
      localStorage.setItem("endpoint",endpoint);
      localStorage.setItem("version",1);

      document.getElementById("endpoint").innerHTML = endpoint;
      document.getElementById("status").innerHTML += "<br/>Successful re-register";
    }

    req.onerror = function(e) {
      console.error("Error getting a new endpoint: " + JSON.stringify(e));
      document.getElementById("status").innerHTML += "<br/>Unsuccessful re-register " + JSON.stringify(e);
    }
  });

  window.navigator.mozSetMessageHandler('push', function(e) {
    console.log('My endpoint is ' + e.pushEndpoint);
    console.log('My new version is ' +  e.version);
    document.getElementById("status").innerHTML += "<br/>Received Push (version " + e.version + ")";
  });
} 
