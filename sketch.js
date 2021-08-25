// This code is trash. Every variable is global. Why? Because I'm an imbecile. I promise I will rewrite everything with proper care next time.

class Node {
  constructor(_id) {
    this.nid = _id;
    this.Neighbours = [];
    this.PosX = 0;
    this.PosY = 0;
    this.selected = false;
  }
}

class downStruct {
  constructor(_id) {
    this.nid = _id;
    this.status = false;
    this.node = 0;
  }
}

function setVariables() {
  directional = false;
  nodeList = [];
  ballSize = 20;
  mouse = new downStruct();

  inputEnabled = true;
}

let button;
let rbutton;
let sel;
let info;

function setInfo(input) {
  info = createP(input);
  info.style("font-size", "16px");
  info.style("color", "white");
  info.position(30, 90);
}
function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER);

  button = createButton("Show Adjacency Matrix");
  button.position(30, 30);
  button.mousePressed(printAdjacencyMatrix);
  button.mouseOver(disableNode);
  button.mouseOut(enableNode);

  rbutton = createButton("Reset");
  rbutton.position(windowWidth - 80, 30);
  rbutton.mousePressed(reset);
  rbutton.mouseOver(disableNode);
  rbutton.mouseOut(enableNode);

  sel = createSelect();
  sel.position(30, 60);
  sel.option("Degree of node");
  sel.option("Distance");
  sel.option("Relative Distance");
  sel.option("Neighbour count");
  sel.option("Number of triangles");
  sel.option("Characteristic path length");
  sel.option("Global efficiency");
  sel.option("Clustering coefficient");
  sel.option("Transitivity");
  sel.option("Local efficiency");
  sel.changed(updateInfo);
  sel.mouseOver(disableNode);
  sel.mouseOut(enableNode);

  setInfo("ASD");

  setVariables();
  refresh();
}

function drawNodes() {
  for (i = 0; i < nodeList.length; i++) {
    node = nodeList[i];
    x = node.PosX;
    y = node.PosY;

    if (node.selected) {
      fill(0, 0, 200);
    } else {
      fill(200, 0, 0);
    }
    ellipse(x, y, ballSize, ballSize);
  }
}
function drawConnexions() {
  for (i = 0; i < nodeList.length; i++) {
    node = nodeList[i];
    ix = node.PosX;
    iy = node.PosY;

    for (j = 0; j < node.Neighbours.length; j++) {
      neighbour = nodeList[node.Neighbours[j]];

      ox = neighbour.PosX;
      oy = neighbour.PosY;
      stroke(125);
      line(ix, iy, ox, oy);
    }
  }
}
function clearSelected() {
  for (i = 0; i < nodeList.length; i++) {
    node = nodeList[i];
    node.selected = false;
  }
}
function getSelected() {
  for (var i = 0; i < nodeList.length; i++) {
    var cnode = nodeList[i];
    if (cnode.selected) return i;
  }
}
function refresh() {
  background(0);
  drawNodes();
  drawConnexions();
  updateInfo();
  //logAdjacencyMatrix();
}
function draw() {}

function mousePressed() {
  if (inputEnabled == false) return;
  // If we clicked on a node, mark it as clicked
  for (i = 0; i < nodeList.length; i++) {
    currentNode = nodeList[i];
    dx = currentNode.PosX - mouseX;
    dy = currentNode.PosY - mouseY;
    ddist = Math.sqrt(dx * dx + dy * dy);
    if (ddist < ballSize) {
      mouse.status = true;
      mouse.node = i;
      return;
    }
  }
}
function mouseDragged() {
  // Draw line from original node
  if (mouse.status == true) {
    nx = nodeList[mouse.node].PosX;
    ny = nodeList[mouse.node].PosY;

    lx = mouseX;
    ly = mouseY;

    refresh();

    stroke(125);
    line(nx, ny, lx, ly);
  }
}
function mouseReleased() {
  if (inputEnabled == false) return;

  if (mouseX == 0 || mouseY == 0) return;
  // If we releasing the mouse from a node, create a connection if possible.
  if (mouse.status == true) {
    for (i = 0; i < nodeList.length; i++) {
      currentNode = nodeList[i];
      dx = currentNode.PosX - mouseX;
      dy = currentNode.PosY - mouseY;
      ddist = Math.sqrt(dx * dx + dy * dy);
      if (ddist < ballSize) {
        inputNode = mouse.node;
        outputNode = i;

        nodeList[inputNode].Neighbours.push(outputNode);
        nodeList[outputNode].Neighbours.push(inputNode);
        break;
      }
    }
    refresh();
    mouse.status = false;
  } else {
    for (i = 0; i < nodeList.length; i++) {
      currentNode = nodeList[i];
      dx = currentNode.PosX - mouseX;
      dy = currentNode.PosY - mouseY;
      ddist = Math.sqrt(dx * dx + dy * dy);
      if (ddist < ballSize) {
        return; // Dont create a node on top of another
      }
    }
    //generate Node
    node = new Node();
    node.PosX = mouseX;
    node.PosY = mouseY;
    nodeList.push(node);

    refresh();
  }
}
function mouseClicked() {
  if (inputEnabled == false) return;
  // Marks the selection of the clicked node
  for (i = 0; i < nodeList.length; i++) {
    currentNode = nodeList[i];
    dx = currentNode.PosX - mouseX;
    dy = currentNode.PosY - mouseY;
    ddist = Math.sqrt(dx * dx + dy * dy);
    if (ddist < ballSize) {
      clearSelected();
      currentNode.selected = true;
      refresh();
    }
  }
  mouse.status = false;
  //logAdjacencyMatrix();
}
function getAdjacencyMatrix() {
  matrixLen = nodeList.length;
  matrix = new Array(matrixLen * matrixLen);

  for (i = 0; i < matrixLen * matrixLen; i++) {
    matrix[i] = 0;
  }
  for (i = 0; i < nodeList.length; i++) {
    node = nodeList[i];
    for (j = 0; j < node.Neighbours.length; j++) {
      neighbour = node.Neighbours[j];
      if (i != neighbour) {
        matrix[matrixLen * i + neighbour] = 1;
      }
    }
  }

  return matrix;
}
function logAdjacencyMatrix() {
  console.log("\n\n\n");
  matrixLen = nodeList.length;
  matrix = getAdjacencyMatrix();

  string = "";
  for (i = 0; i < matrixLen; i++) {
    for (j = 0; j < matrixLen; j++) {
      string = string + " " + str(matrix[i * matrixLen + j]);
    }
    string = string + "\n";
  }

  console.log(string);
  //alert(string)
}
function printAdjacencyMatrix() {
  matrixLen = nodeList.length;
  matrix = getAdjacencyMatrix();

  string = "";
  for (i = 0; i < matrixLen; i++) {
    for (j = 0; j < matrixLen; j++) {
      string = string + " " + str(matrix[i * matrixLen + j]);
    }
    string = string + "\n";
  }
  alert(string);
}
function disableNode() {
  //console.log("Disabled")
  inputEnabled = false;
}
function enableNode() {
  //console.log("Enabled")
  inputEnabled = true;
}
function updateInfo() {
  if (mouse.status == true) return;
  infoType = sel.value();
  var content = "";
  var snode = getSelected();
  if (infoType == "Degree of node") {
    degree = getNodeDegree();
    content = "k(i) = " + str(degree);
    info.html(content);
  } else if (infoType == "Number of triangles") {
    var triangles = getTriangleCount(snode);
    content = "t(i) = " + str(triangles);
    info.html(content);
  } else if (infoType == "Distance") {
    content = "";
    for (ni = 0; ni < nodeList.length; ni++) {
      distance_row = getDistance(ni);
      content = content + str(distance_row) + "<br>";
    }
    info.html(content);
  } else if (infoType == "Relative Distance") {
    content = "";
    for (ni = 0; ni < nodeList.length; ni++) {
      distance_row = getRelativeDistance(snode, ni);
      content = content + str(distance_row) + "<br>";
    }
    info.html(content);
  } else if (infoType == "Neighbour count") {
    content = "";
    for (ni = 0; ni < nodeList.length; ni++) {
      neighbours = getNeighbourCount(ni);
      content = content + str(neighbours) + " ";
    }
    info.html(content);
  } else if (infoType == "Characteristic path length") {
    globalCPL = getGlobalCharacteristicPathLength();
    localCPL = getCharacteristicPathLength(snode);
    content = "L(i) = " + str(localCPL) + "<br>L = " + globalCPL;
    info.html(content);
  } else if (infoType == "Global efficiency") {
    var globalEFC = getGlobalEfficiency();
    var localEFC = getNodeEfficiency(snode);
    content = "E(i) = " + str(localEFC) + "<br>E = " + globalEFC;
    info.html(content);
  } else if (infoType == "Clustering coefficient") {
    var localCC = getNodeClusteringCoefficient(snode);
    var globalCC = getClusteringCoefficient();
    content = "C(i) = " + str(localCC) + "<br>C = " + str(globalCC);
    info.html(content);
  } else if (infoType == "Transitivity") {
    var trans = getTransitivity();
    content = "T = " + str(trans);
    info.html(content);
  } else if (infoType == "Local efficiency") {
    var lEff = getlocalNodeEfficiency(snode);
    var gEff = getLocalEfficiency();
    content = "E_loc(i) = " + str(lEff) + "<br>E_loc = " + str(gEff);
    info.html(content);
  }
}

function getNodeDegree() {
  for (var nodei = 0; nodei < nodeList.length; nodei++) {
    var currentNode = nodeList[nodei];
    if (currentNode.selected == true) {
      var matrix = getAdjacencyMatrix();
      var matrixLen = nodeList.length;
      var degree = 0;
      for (var nodej = 0; nodej < matrixLen; nodej++) {
        var arrayPos = nodei * matrixLen + nodej;
        if (matrix[arrayPos] == 1) degree++;
      }
      return degree;
    }
  }
}

function getTriangleCount(nodei) {
  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;
  var triangles = 0;
  for (var nodej = 0; nodej < matrixLen; nodej++) {
    if (nodei == nodej) continue;
    for (var nodek = 0; nodek < matrixLen; nodek++) {
      if (nodei == nodek || nodej == nodek) continue;
      array_ij = nodei * matrixLen + nodej;
      array_ik = nodei * matrixLen + nodek;
      array_jk = nodej * matrixLen + nodek;

      if (
        matrix[array_ij] == 1 &&
        matrix[array_ik] == 1 &&
        matrix[array_jk] == 1
      ) {
        triangles++;
      }
    }
  }
  return Math.floor(triangles / 2.0);
}

function getRelativeDistance(centerNode, nodea) {
  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;

  if (nodea >= matrixLen) return Infinity;

  var visitedNodes = [];
  var nodesDistance = new Array(matrixLen);
  var toVisit = [nodea];

  for (var i = 0; i < matrixLen; i++) {
    nodesDistance[i] = Infinity;
    if (i == nodea) nodesDistance[i] = 0;
  }

  var step = 1;
  while (toVisit.length > 0) {
    var nextVisit = [];
    //console.log("Step: " + str(step))
    //console.log("toVisit: " + str(toVisit))
    //console.log("visitedNodes: " + str(visitedNodes));
    //console.log("nodesDistance: " + str(nodesDistance));
    for (var j = 0; j < toVisit.length; j++) {
      var current_node = toVisit[j];

      visitedNodes.push(current_node);

      for (var new_node = 0; new_node < matrixLen; new_node++) {
        var array_pos = current_node * matrixLen + new_node;

        if (matrix[array_pos] == 1) {
          if (step < nodesDistance[new_node]) {
            nodesDistance[new_node] = step;

            if (visitedNodes.indexOf(new_node) == -1) {
              var relative_array_pos = centerNode * matrixLen + new_node;

              if (matrix[relative_array_pos] == 1 || centerNode == new_node) {
                nextVisit.push(new_node);
              }
            }
          }
        }
      }
    }

    //console.log("nextVisit: " + str(nextVisit));
    toVisit = nextVisit;
    step++;

    if (step > 1000)
      // Something went wrong!
      return;
  }

  return nodesDistance;
}
function getDistance(nodea) {
  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;

  if (nodea >= matrixLen) return Infinity;

  var visitedNodes = [];
  var nodesDistance = new Array(matrixLen);
  var toVisit = [nodea];

  for (var i = 0; i < matrixLen; i++) {
    nodesDistance[i] = Infinity;
    if (i == nodea) nodesDistance[i] = 0;
  }

  var step = 1;
  while (toVisit.length > 0) {
    var nextVisit = [];
    //console.log("Step: " + str(step))
    //console.log("toVisit: " + str(toVisit))
    //console.log("visitedNodes: " + str(visitedNodes));
    //console.log("nodesDistance: " + str(nodesDistance));
    for (var j = 0; j < toVisit.length; j++) {
      var current_node = toVisit[j];

      visitedNodes.push(current_node);

      for (var new_node = 0; new_node < matrixLen; new_node++) {
        var array_pos = current_node * matrixLen + new_node;

        if (matrix[array_pos] == 1) {
          if (step < nodesDistance[new_node]) {
            nodesDistance[new_node] = step;
            if (visitedNodes.indexOf(new_node) == -1) {
              nextVisit.push(new_node);
            }
          }
        }
      }
    }

    //console.log("nextVisit: " + str(nextVisit));
    toVisit = nextVisit;
    step++;

    if (step > 1000)
      // Something went wrong!
      return;
  }

  return nodesDistance;
}

function getNeighbourCount(nodec) {
  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;

  var ncount = 0;
  for (var ic = 0; ic < matrixLen; ic++) {
    if (ic == nodec) continue;

    var array_pos = nodec * matrixLen + ic;

    if (matrix[array_pos] == 1) ncount++;
  }

  return ncount;
}

function getCharacteristicPathLength(kknode) {
  var matrixLen = nodeList.length;
  var distsum = 0;
  var distlist = getDistance(kknode);
  for (var nodecount_i = 0; nodecount_i < matrixLen; nodecount_i++) {
    if (distlist[nodecount_i] == Infinity) return Infinity;
    distsum = distsum + distlist[nodecount_i];
  }

  return distsum / (distlist.length - 1);
}
function getGlobalCharacteristicPathLength() {
  var gcpavg = 0;
  for (var nodei = 0; nodei < nodeList.length; nodei++) {
    gcpavg = gcpavg + getCharacteristicPathLength(nodei);
  }
  return gcpavg / nodeList.length;
}

function getNodeEfficiency(knode) {
  var matrixLen = nodeList.length;
  var distsum = 0;
  var distlist = getDistance(knode);
  for (var nodecount_i = 0; nodecount_i < matrixLen; nodecount_i++) {
    if (nodecount_i == knode) continue;
    distsum = distsum + 1.0 / distlist[nodecount_i];
  }

  return distsum / (distlist.length - 1);
}
function getGlobalEfficiency() {
  var globefc = 0;
  for (var nodei = 0; nodei < nodeList.length; nodei++) {
    globefc = globefc + getNodeEfficiency(nodei);
  }
  return globefc / nodeList.length;
}

function getNodeClusteringCoefficient(knode) {
  var triangleCount = getTriangleCount(knode);
  var neighbourCount = getNeighbourCount(knode);

  var clustcoeff =
    triangleCount == 0
      ? 0
      : (2.0 * triangleCount) / (neighbourCount * (neighbourCount - 1));

  return clustcoeff;
}
function getClusteringCoefficient() {
  var gblCluster = 0;
  for (var i = 0; i < nodeList.length; i++) {
    gblCluster = gblCluster + getNodeClusteringCoefficient(i);
  }
  return gblCluster / nodeList.length;
}

function getTransitivity() {
  var numerator = 0;
  var denominator = 0;

  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;

  var triangleCount = 0;
  var neighbourCount = 0;
  for (var i = 0; i < matrixLen; i++) {
    triangleCount = getTriangleCount(i);
    neighbourCount = getNeighbourCount(i);

    numerator = numerator + 2 * triangleCount;
    denominator = denominator + neighbourCount * (neighbourCount - 1);
  }

  var transitivity = numerator / denominator;
  return transitivity;
}

function getlocalNodeEfficiency(i) {
  var matrix = getAdjacencyMatrix();
  var matrixLen = nodeList.length;

  var result = 0;
  for (var j = 0; j < matrixLen; j++) {
    if (j == i) continue;
    for (var k = 0; k < matrixLen; k++) {
      if (k == j || k == i) continue;

      var array_ij = i * matrixLen + j;
      var array_ik = i * matrixLen + k;

      var adota = matrix[array_ij] * matrix[array_ik];

      var reldist_ijk = getRelativeDistance(i, j)[k]; // Same as getRelativeDistance(i, k)[j]

      //console.log(
      //  "Relative Distance " + str(j) + " " + str(k) + " = " + str(reldist_ijk)
      //);

      r = adota == 0 ? 0 : adota * (1.0 / reldist_ijk);

      result = result + r;

      //console.log("R = " + str(r));
    }
  }
  var denominator = getNeighbourCount(i);

  var output = result == 0 ? 0 : result / (denominator * (denominator - 1));
  return output;
}
function getLocalEfficiency() {
  var gblEfficiency = 0;
  for (var i = 0; i < nodeList.length; i++) {
    gblEfficiency = gblEfficiency + getlocalNodeEfficiency(i);
  }
  return gblEfficiency / nodeList.length;
}

function reset() {
  info.html("");
  setup();
}
