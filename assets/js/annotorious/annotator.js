var fileInput = document.getElementById("fileSelector");
function fileUpload(){
  if (fileInput.files[0]) {
    fileInput.parentElement.submit();
  }
}

function addslashes (str) {
  //  discuss at: http://locutus.io/php/addslashes/
  // original by: Kevin van Zonneveld (http://kvz.io)
  // improved by: Ates Goral (http://magnetiq.com)
  // improved by: marrtins
  // improved by: Nate
  // improved by: Onno Marsman (https://twitter.com/onnomarsman)
  // improved by: Brett Zamir (http://brett-zamir.me)
  // improved by: Oskar Larsson Högfeldt (http://oskar-lh.name/)
  //    input by: Denny Wardhana
  //   example 1: addslashes("kevin's birthday")
  //   returns 1: "kevin\'s birthday"
  return (str + '')
  .replace(/[\\"']/g, '\\$&')
  .replace(/\u0000/g, '\\0')
}

function escapeHtml(text) {
  return text
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");
}

var submitCollection = [];
function submitCollected() {
  console.log(submitCollection);
}

$(document).on("ready", function() {
  var activeImage = 0;
  var showJson = false;
  var uid = location.pathname.substr(location.pathname.lastIndexOf("/")+1);
  if(uid !== "annotator") {
    var xhttp;
    if (window.XMLHttpRequest) {
      // code for modern browsers
      xhttp = new XMLHttpRequest();
    } else {
      // code for old IE browsers
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var json = JSON.parse(this.responseText);
        if (!json["Sequence"]) {
          json["Sequence"] = Object.keys(json["tags"]);
        }
        submitCollection.length = json["pictures"].length;
        $("#page-tracker").text((1 + activeImage) + " / " + json["pictures"].length);
        var images = $("#images");
        images.empty();
        var first = true;
        for (var pictureIndex in json["pictures"]) {
          var img = document.createElement("img");
          img.setAttribute("src", json["pictures"][pictureIndex]);
          img.setAttribute("alt", "Error");
          var imgwrapper = document.createElement("div");
          if (first) {
            imgwrapper.classList.add("active-image");
            first = false;
          }
          imgwrapper.append(img);
          images.append(imgwrapper);
        }

        var finalReverses = [];
        var extra_space = 0.002;

        for (var pictureIndex in json["pictures"]) {
          var reverseFile = json["pictures"][pictureIndex] + ".reverse.json";
          var xhttp;
          if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
          } else {
            // code for old IE browsers
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
          }
          xhttp.onreadystatechange = (function(i) {
            return function() {
              if (this.readyState == 4 && this.status == 200) {
                var subjson = JSON.parse(this.responseText);
                finalReverses[i] = subjson;
                var src = json["pictures"][i];
                var finalLines = {};
                var lines = subjson["lines"];
                var realwidth = subjson["width"];
                var realheight = subjson["height"];
                if (realwidth === undefined || realwidth === null) {
                  return;
                }
                var add_later = [];
                for (var groupname in json["tags"]) {
                  var tag = json["tags"][groupname];
                  for (var annotationIndex in tag) {
                    var annotation = tag[annotationIndex];
                    if (annotation["upperleft"][0] === i) {
                      var northlimit = null;
                      var eastlimit = null;
                      var southlimit = null;
                      var westlimit = null;
                      for (var j = annotation["upperleft"][1]; j <= annotation["lowerright"][1]; j++) {
                        var line = lines[j];
                        var offset = 0;
                        if (!(annotation["upperleft"][2] in line)) {
                          offset--;
                          if (!((annotation["upperleft"][2] + offset) in line)) {
                            offset++;
                          }
                        }
                        for (var key in line) {
                          var value = line[key];
                          if (key >= annotation["upperleft"][2] + offset && key <= annotation["lowerright"][2]) {
                            var min_x = Math.min(value["vertices"][0]["x"], value["vertices"][3]["x"]);
                            var max_x = Math.max(value["vertices"][1]["x"], value["vertices"][2]["x"]);
                            var min_y = Math.min(value["vertices"][0]["y"], value["vertices"][1]["y"]);
                            var max_y = Math.max(value["vertices"][2]["y"], value["vertices"][3]["y"]);
                            if (northlimit === null || northlimit > min_y) {
                              northlimit = min_y;
                            }
                            if (eastlimit === null || eastlimit < max_x) {
                              eastlimit = max_x;
                            }
                            if (southlimit === null || southlimit < max_y) {
                              southlimit = max_y;
                            }
                            if (westlimit === null || westlimit > min_x) {
                              westlimit = min_x;
                            }
                          }
                        }
                        line["used"] = (northlimit !== null);
                      }
                      if (northlimit !== null) {
                        var x = Math.max(0, westlimit/realwidth - extra_space);
                        var y = Math.max(0, northlimit/realheight - extra_space);
                        var width = Math.min(1, (eastlimit - westlimit)/realwidth + extra_space*2);
                        var height = Math.min(1, (southlimit - northlimit)/realheight + extra_space*2);

                        var geometry = {
                          x: (typeof x === "number"?x:parseFloat(x.replace(',', '.'))),
                          y: (typeof y === "number"?y:parseFloat(y.replace(',', '.'))),
                          width: (typeof width === "number"?width:parseFloat(width.replace(',', '.'))),
                          height: (typeof height === "number"?height:parseFloat(height.replace(',', '.')))
                        };
                        var shape = {type: 'rect', geometry: geometry};
                        annotation["src"] = src;
                        annotation["shapes"] = [shape];
                        annotation["group"] = groupname;
                        annotation["lineIndex"] = annotation["upperleft"][1];
                        if (annotation["upperleft"][1] != annotation["lowerright"][1]){
                          add_later.push(annotation);
                        } else {
                          var finalLine = (annotation["upperleft"][1] in finalLines?finalLines[annotation["upperleft"][1]]:{});
                          finalLine[addslashes(groupname)] = annotation;
                          finalLines[annotation["upperleft"][1]] = finalLine;
                        }
                      }
                    }
                  }
                  for (var annotationIndex in add_later) {
                    var annotation = add_later[annotationIndex];
                    var finalLine = {};
                    var finalIndex = annotation["upperleft"][1];
                    for (var j = annotation["upperleft"][1]; j <= annotation["lowerright"][1]; j++) {
                      if (j in finalLines) {
                        finalLine = finalLines[j];
                        finalIndex = j;
                      }
                    }
                    finalLine[addslashes(annotation["group"])] = annotation;
                    finalLines[finalIndex] = finalLine;
                  }
                }

                var fixing = false;
                var fixButtonList;
                function updateFixButton() {
                  var fixButton = document.getElementById("fix-button");
                  if (fixing) {
                    fixButton.children[0].textContent = "Fixing";
                    fixButton.classList.add("fb-fixing");
                  } else {
                    fixButton.children[0].textContent = "Fixed";
                    fixButton.classList.add("fb-fixed");
                    hideBarBox();
                    document.body.scrollIntoView();
                  }
                }

                function fixNextInList() {
                  if (!fixing) {
                    updateFixButton();
                    return;
                  }
                  if (!fixButtonList || fixButtonList.length <= 0) {
                    fixing = false;
                    updateFixButton();
                    return;
                  }
                  fixing = true;
                  var currentAnnotation = fixButtonList.shift();
                  drawBarBox(currentAnnotation.lineIndex, currentAnnotation.group);
                  currentAnnotation.fixBox();
                  currentAnnotation["error"] = false;
                  updateFixButton();
                }

                $("#fix-button").on("click", function() {
                  if (i !== activeImage) {
                    return;
                  }
                  fixing = true;
                  fixButtonList = [];
                  for (var lineIndex in finalLines) {
                    for (var annotationIndex in finalLines[lineIndex]) {
                      var tempAnnotation = finalLines[lineIndex][annotationIndex];
                      if (tempAnnotation["error"]) {
                        fixButtonList.push(tempAnnotation);
                      }
                    }
                  }
                  fixNextInList();
                });
                if (i === 0) {
                  $("#fix-button").show();
                }

                function clearAnnotations() {
                  var activeImageWrapper = $("#images .active-image").get(0);
                  if (!activeImageWrapper) {
                    return;
                  }
                  while (activeImageWrapper.children.length > 1) {
                    activeImageWrapper.removeChild(activeImageWrapper.lastChild);
                  }
                }

                var barBox = document.getElementById("barbox");

                if (i === 0) {
                  $("#barbox").draggable({
                    axis: "y",
                    containment: "#draggable-containment"
                  });
                }

                var lastActiveField = {};

                function hideBarBox() {
                  barBox.style.display = "none";
                  lastActiveField = {};
                }

                function drawBarBox(lineIndex, group) {
                  lineIndex = String(lineIndex);
                  var line = lines[lineIndex];
                  var finalLine = finalLines[lineIndex];
                  if (!finalLine) {
                    finalLine = {}
                    finalLines[lineIndex] = finalLine;
                  }
                  var lowest;
                  for (var fieldIndex in line) {
                    if (isNaN(parseInt(fieldIndex))) {
                      continue;
                    }
                    var field = line[fieldIndex];
                    if (!lowest || lowest > field["vertices"][3]["y"]) {
                      lowest = field["vertices"][3]["y"];
                    }
                  }
                  while(barBox.hasChildNodes()) {
                    barBox.removeChild(barBox.firstChild);
                  }
                  barBox.style.top = (lowest / realheight * $("#images .active-image").get(0).clientHeight + 10) + "px";
                  barBox.style.display = "flex";
                  var firstEmtpy = true;
                  for (var sequenceIndex in json["Sequence"]) {
                    var groupname = json["Sequence"][sequenceIndex];
                    var annotation = finalLine[groupname];
                    var fieldDiv = document.createElement("div");
                    var fieldLabel = document.createElement("label");
                    fieldLabel.setAttribute("for", groupname);
                    fieldLabel.textContent = groupname;
                    fieldDiv.appendChild(fieldLabel);
                    var fieldInput = document.createElement("input");
                    fieldInput.id = groupname;
                    fieldInput.classList.add("group-field");
                    fieldInput.setAttribute("type", "text");
                    fieldInput.setAttribute("name", groupname);
                    fieldInput.setAttribute("placeholder", groupname);
                    if (annotation) {
                      fieldInput.setAttribute("value", escapeHtml(annotation["text"]));
                    } else {
                      annotation = {src: src, group: groupname, lineIndex: lineIndex, creating: true, text: ""};
                      finalLine[groupname] = annotation;
                    }
                    fieldInput.onkeydown = (function(sequenceIndex) {
                      return function(event) {
                        if (event.keyCode === 13) {
                          event.preventDefault();
                          if (fixing) {
                            fixNextInList();
                            return;
                          }
                          hideBarBox();
                        }
                        if (event.keyCode === 9) {
                          if (fixing) {
                            event.preventDefault();
                            fixNextInList();
                            return;
                          }
                          var lineKeys = Object.keys(finalLines);
                          if (parseInt(sequenceIndex) + 1 >= json["Sequence"].length && !event.shiftKey) {
                            event.preventDefault();
                            var nextLineIndex = lineKeys[lineKeys.indexOf(lineIndex)+1];
                            if (nextLineIndex) {
                              drawBarBox(nextLineIndex, json["Sequence"][0]);
                            } else {
                              createAddManualButton();
                              document.getElementById("manual-button").click();
                            }
                          } else if (parseInt(sequenceIndex) <= 0 && event.shiftKey) {
                            event.preventDefault();
                            var prevLineIndex = lineKeys[lineKeys.indexOf(lineIndex)-1];
                            if (prevLineIndex) {
                              drawBarBox(prevLineIndex, json["Sequence"][json["Sequence"].length - 1]);
                            } else {
                              hideBarBox();
                            }
                          }
                        }
                      }
                    })(sequenceIndex);
                    fieldInput.onfocusout = (function(annotation) {
                      return function(event) {
                        lastActiveField = {annotation: annotation, element: event.target};
                        if (annotation) {
                          annotation["text"] = event.target.value;
                          if (!annotation["creating"]) {
                            if (annotation["error"]) {
                              annotation.fixBox();
                              annotation["error"] = false;

                            }
                            lastActiveField.annotation.deactivateBox();
                          }
                        }
                      }
                    })(annotation);
                    fieldInput.onfocusin = (function(annotation) {
                      return function(event) {
                        if (annotation && !annotation["creating"]) {
                          annotation.activateBox();
                        }
                        if (lastActiveField && lastActiveField.element) {
                          lastActiveField.element.parentElement.style["flex-shrink"] = null;
                          lastActiveField.element.parentElement.style.width = null;
                        }
                        event.target.parentElement.style["flex-shrink"] = 0;
                        event.target.parentElement.style.width = "25%";
                      }
                    })(annotation);
                    fieldDiv.appendChild(fieldInput);
                    barBox.appendChild(fieldDiv);
                    if (group === groupname) {
                      fieldInput.focus();
                    } else if (!group && firstEmtpy) {
                      firstEmtpy = false;
                      fieldInput.focus();
                    }
                  }
                }

                function createAnnotationBox(annotation) {
                  if (!annotation) {
                    return;
                  }
                  var box = document.createElement("div");
                  box.style.left = annotation["shapes"][0]["geometry"]["x"] * 100 + "%";
                  box.style.top = annotation["shapes"][0]["geometry"]["y"] * 100 + "%";
                  box.style.width = annotation["shapes"][0]["geometry"]["width"] * 100 + "%";
                  box.style.height = annotation["shapes"][0]["geometry"]["height"] * 100 + "%";

                  box.classList.add("annotation");
                  if (annotation["error"]) {
                    box.classList.add("annotation-error");
                  }
                  annotation["activateBox"] = (function(thisbox) {
                    return function() {
                      thisbox.classList.add("annotation-active");
                    }
                  })(box);
                  annotation["deactivateBox"] = (function(thisbox) {
                    return function() {
                      thisbox.classList.remove("annotation-active");
                    }
                  })(box);
                  annotation["fixBox"] = (function(thisbox) {
                    return function() {
                      thisbox.classList.remove("annotation-error")
                      thisbox.classList.add("annotation-fixed")
                    }
                  })(box);
                  annotation["destroyBox"] = (function(thisbox) {
                    return function() {
                      thisbox.remove();
                    }
                  })(box);

                  box.onclick = (function(annotation) {
                    return function(event) {
                      event.stopImmediatePropagation();
                      drawBarBox(annotation.lineIndex, annotation.group);
                    }
                  })(annotation);

                  return box;
                }

                var manuallyAddedButtons = [];

                function leaveButtonBehind(index) {
                  var manualButton = document.getElementById("manual-button");
                  var button = document.createElement("div");
                  button.classList.add("added-button");
                  button.style.left = manualButton.style.left;
                  button.style.top = manualButton.style.top;

                  button.onclick = function(event) {
                    event.stopImmediatePropagation();
                    drawBarBox(index);
                  }

                  $("#images>div")[i].appendChild(button);
                  manuallyAddedButtons.push(button);
                }

                function createAddManualButton() {
                  var button = document.getElementById("manual-button");
                  if (button) {
                    button.remove();
                  }
                  var lineKeys = Object.keys(finalLines);
                  var finalLine = finalLines[lineKeys[lineKeys.length - 1]];
                  if (!finalLine) {
                    return;
                  }
                  var value = finalLine[json["Sequence"][0]];
                  if (!value) {
                    return;
                  }
                  var prevValue = finalLines[lineKeys[lineKeys.length - 2]][json["Sequence"][0]];
                  button = document.createElement("div");
                  button.id = "manual-button";
                  if (!prevValue || !prevValue["offset_x"]) {
                    value["offset_x"] = value["shapes"][0]["geometry"]["x"] - 0.02;
                    value["offset_y"] = value["shapes"][0]["geometry"]["y"] + value["shapes"][0]["geometry"]["height"] + 0.002;
                  } else {
                    value["offset_x"] = prevValue["offset_x"];
                    value["offset_y"] = prevValue["offset_y"] + finalLines[lineKeys[0]][json["Sequence"][0]]["shapes"][0]["geometry"]["height"] + 0.002;
                  }
                  button.style.left = value["offset_x"] * 100 + "%";
                  button.style.top = value["offset_y"] * 100 + "%";
                  var span = document.createElement("span");
                  span.textContent = 	"+";
                  button.appendChild(span);
                  $("#images>div")[activeImage].appendChild(button);

                  button.onclick = function(event) {
                    event.stopImmediatePropagation();
                    var index = parseInt(lineKeys[lineKeys.length - 1]) + 1;
                    leaveButtonBehind(index);
                    drawBarBox(index);
                    createAddManualButton();
                  }
                }

                function loadAnnotations() {
                  var imgwrapper = $("#images>div")[activeImage];
                  imgwrapper.onclick = function() {
                    hideBarBox();
                  }
                  createAddManualButton(imgwrapper);
                  var firstUsedIndex;
                  var lastUsedIndex;
                  for (var lineIndex in lines) {
                    var line = lines[lineIndex];
                    if (line["used"]) {
                      if (firstUsedIndex === undefined) {
                        firstUsedIndex = parseInt(lineIndex);
                      }
                      lastUsedIndex = parseInt(lineIndex);
                    }
                  }
                  for (var lineIndex in lines) {
                    var line = lines[lineIndex];
                    if (line["used"] && lineIndex in finalLines) {
                      var finalLine = finalLines[lineIndex];
                      for (var annotationIndex in finalLine) {
                        var annotation = finalLine[annotationIndex];
                        imgwrapper.appendChild(createAnnotationBox(annotation));
                      }
                      continue;
                    }
                    if (firstUsedIndex < parseInt(lineIndex) && parseInt(lineIndex) < lastUsedIndex) {
                      for (var annotationIndex in line) {
                        var value = line[annotationIndex];
                        if (value) {
                          var min_x = Math.min(value["vertices"][0]["x"], value["vertices"][3]["x"]);
                          var max_x = Math.max(value["vertices"][1]["x"], value["vertices"][2]["x"]);
                          var min_y = Math.min(value["vertices"][0]["y"], value["vertices"][1]["y"]);
                          var max_y = Math.max(value["vertices"][2]["y"], value["vertices"][3]["y"]);
                          var x = Math.max(0, min_x/realwidth - extra_space);
                          var y = Math.max(0, min_y/realheight - extra_space);
                          var width = Math.min(1, (max_x - min_x)/realwidth + extra_space*2);
                          var height = Math.min(1, (max_y - min_y)/realheight + extra_space*2);

                          var box = document.createElement("div");
                          box.style.left = x * 100 + "%";
                          box.style.top = y * 100 + "%";
                          box.style.width = width * 100 + "%";
                          box.style.height = height * 100 + "%";
                          box.classList.add("possible-annotation");

                          box.onclick = (function(lineIndex, annotationIndex) {
                            return function(event) {
                              event.stopImmediatePropagation();
                              if (!lastActiveField.annotation || !lastActiveField.element) {
                                drawBarBox(lineIndex);
                                return;
                              }
                              var sequenceIndex = json["Sequence"].indexOf(lastActiveField.annotation.group);
                              var annotation;
                              var element;
                              if ((event.shiftKey || (sequenceIndex === 0 && lastActiveField.annotation.text === "")) && lastActiveField.annotation["creating"]) {
                                annotation = lastActiveField.annotation;
                                element = lastActiveField.element;
                              } else {
                                lastActiveField.annotation["creating"] = false;
                                annotation = finalLines[lastActiveField.annotation.lineIndex][json["Sequence"][sequenceIndex + 1]];
                                if (lastActiveField.element.parentElement.nextSibling) {
                                  element = lastActiveField.element.parentElement.nextSibling.children[1];
                                }
                              }
                              if (!annotation || !annotation["creating"] || !element) {
                                drawBarBox(lineIndex);
                                return;
                              }

                              var boxes = annotation["boxes"];
                              if (!boxes) {
                                boxes = [];
                                annotation["boxes"] = boxes;
                              }
                              boxes.push(lines[lineIndex][annotationIndex]);
                              element.value += (element.value.length === 0?"":" ") + lines[lineIndex][annotationIndex]["word"];

                              var min_x;
                              var max_x;
                              var min_y;
                              var max_y;
                              for (var boxIndex in boxes) {
                                var box = boxes[boxIndex];
                                var box_min_x = Math.min(box["vertices"][0]["x"], box["vertices"][3]["x"]);
                                var box_max_x = Math.max(box["vertices"][1]["x"], box["vertices"][2]["x"]);
                                var box_min_y = Math.min(box["vertices"][0]["y"], box["vertices"][1]["y"]);
                                var box_max_y = Math.max(box["vertices"][2]["y"], box["vertices"][3]["y"]);
                                if (!min_x || min_x > box_min_x) {
                                  min_x = box_min_x;
                                }
                                if (!max_x || max_x < box_max_x) {
                                  max_x = box_max_x;
                                }
                                if (!min_y || min_y > box_min_y) {
                                  min_y = box_min_y;
                                }
                                if (!max_y || max_y > box_max_y) {
                                  max_y = box_max_y;
                                }
                              }

                              annotation["shapes"] = [{geometry: {
                                x: Math.max(0, min_x/realwidth - extra_space),
                                y: Math.max(0, min_y/realheight - extra_space),
                                width: Math.min(1, (max_x - min_x)/realwidth + extra_space*2),
                                height: Math.min(1, (max_y - min_y)/realheight + extra_space*2)
                              }}];

                              if (annotation["destroyBox"]) {
                                annotation.destroyBox();
                              }
                              imgwrapper.appendChild(createAnnotationBox(annotation));
                              element.focus();
                              lines[lineIndex]["used"] = true;
                              event.target.remove();
                            }
                          })(lineIndex, annotationIndex);

                          imgwrapper.appendChild(box);
                        }
                      }
                    }
                  }
                  for (var button of manuallyAddedButtons) {
                    $("#images>div")[activeImage].appendChild(button);
                  }
                }

                function resolveButtons() {
                  if (activeImage < 1) {
                    $("#image-navigator-buttons button")[0].disabled = true;
                  } else if (activeImage >= json["pictures"].length - 1) {
                    $("#image-navigator-buttons button")[1].disabled = true;
                  } else {
                    $("#image-navigator-buttons button")[0].disabled = false;
                    $("#image-navigator-buttons button")[1].disabled = false;
                  }
                }

                if (i === 0) {
                  if ($("#images .active-image img").get(0).naturalWidth > 0) {
                    loadAnnotations();
                  } else {
                    $("#images .active-image img").load(function() {
                      loadAnnotations();
                    });
                  }
                  resolveButtons();
                }

                function switchActiveImage(incr) {
                  if (activeImage + incr >= 0 && activeImage + incr < $("#images>div").length) {
                    hideBarBox();
                    clearAnnotations();
                    $("#images>div")[activeImage].classList.remove("active-image");
                    activeImage += incr;
                    $("#images>div")[activeImage].classList.add("active-image");
                    $("#page-tracker").text((1 + activeImage) + " / " + json["pictures"].length);
                  }
                }

                $(document).on("switchImage", function() {
                  if (i !== activeImage) {
                    return;
                  }
                  if (showJson) {
                    loadJson();
                  } else {
                    loadAnnotations();
                  }
                  resolveButtons();
                });

                $("#image-navigator-buttons button").on("click", function(event) {
                  if (i !== activeImage) {
                    return;
                  }
                  event.stopImmediatePropagation();
                  if (event.target.tagName.toLowerCase() === "span") {
                    event.target = event.target.parentElement;
                  }
                  if ($("#image-navigator-buttons button").index($(event.target)) === 0) {
                    switchActiveImage(-1);
                  } else {
                    switchActiveImage(1);
                  }
                  $(document).trigger("switchImage");
                });

                var jsonDataElement = document.getElementById("json-data");
                function loadJson() {
                  if (jsonDataElement.firstChild !== null) {
                    jsonDataElement.removeChild(jsonDataElement.firstChild);
                  }
                  clearAnnotations();
                  $("#images>div")[activeImage].classList.remove("active-image");

                  var sortedLines = [];
                  Object.keys(finalLines).sort().forEach(function(key) {
                    var jsonLine = {};
                    for (var jsonKey in finalLines[key]) {
                      jsonLine[jsonKey] = finalLines[key][jsonKey]["text"];
                    }
                    sortedLines.push(jsonLine);
                  });

                  jsonDataElement.appendChild(renderjson.set_icons('+', '-').set_show_to_level("all")(sortedLines));
                }

                $("#toggle-json").on("click", function() {
                  if (i !== activeImage) {
                    return;
                  }
                  if (showJson) {
                    jsonDataElement.removeChild(jsonDataElement.firstChild);
                    $("#images>div")[activeImage].classList.add("active-image");
                    loadAnnotations();
                  } else {
                    loadJson();
                  }
                  showJson = !showJson;
                });

                $("#annotator-submit").on("click", function() {
                  var sortedLines = [];
                  Object.keys(finalLines).sort().forEach(function(key) {
                    var jsonLine = {};
                    for (var jsonKey in finalLines[key]) {
                      jsonLine[jsonKey] = finalLines[key][jsonKey]["text"];
                    }
                    sortedLines.push(jsonLine);
                  });
                  submitCollection[i] = sortedLines;

                  var collected = true;
                  for (var collect of submitCollection) {
                    if (!collect) {
                      collected = false;
                      break;
                    }
                  }

                  if (collected) {
                    submitCollected();
                  }
                });
              }
            }
          })(parseInt(pictureIndex));
          xhttp.open("GET", reverseFile, true);
          xhttp.send();
        }
      }
    };
    xhttp.open("GET", "/output/" + uid + "/input.json", true);
    xhttp.send();
  }
});
