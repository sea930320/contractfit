function cf_upload_clicked(){
  var filesList1 = document.getElementById("upload");
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var port = document.getElementById("port").value;

  var file1 = filesList1.files[0];

  if(!file1){
      alert('You must select a file.');
      return false;
  }

  var fd = new FormData();
  fd.append("username", username);
  fd.append("password", password);
  fd.append("upl",file1);

  var xhr = new XMLHttpRequest();
  console.log("https://contract.fit:"+port+"/upload");
  xhr.open('POST', "https://contract.fit:"+port+"/upload", true);
  xhr.onreadystatechange = function(){
      var r = cf_fnReady(xhr);
  };
  xhr.onload = function(){ };
  xhr.send(fd);
}

function cf_fnReady(xhr) {
  if (xhr.readyState === XMLHttpRequest.DONE)
  {
      if (xhr.status == 200)
      {
          jsonResponse = JSON.parse(xhr.responseText);
          var result = document.getElementById('live-result');
          try {
              var formatter = new JSONFormatter(jsonResponse, 2, {hoverPreviewEnabled: true});
              result.innerHTML = '';
              result.appendChild(formatter.render());
          } catch(e) {
              result.innerHTML = 'error';
          }
      }
      else{
          var result = document.getElementById('live-result');
          result.innerHTML = 'error';
      }
  }
}
