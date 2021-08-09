$(document).ready(function () {

    $("#scroll-nav-bar").hide();
  
    window.onscroll = function () {
      scrollFunction();
      myFunction();
    };
  
    function scrollFunction() {
      if (
        (document.body.scrollTop > 140 && document.body.scrollTop < 800) ||
        (document.documentElement.scrollTop > 140 &&
          document.documentElement.scrollTop < 800)
      ) {
        $("#nav-bar").css("visibility", "hidden");
        $("#scroll-nav-bar").show();
      } else {
        $("#nav-bar").css("visibility", "visible");
        $("#scroll-nav-bar").hide();
      }
    }
  
    var header = document.getElementById("scroll-nav-bar");
    var sticky = header.offsetTop;
  
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
      } else {
        header.classList.remove("sticky");
      }
    }

    var reagentButton;
    var productButton;

    $(".reagents button").click(function () {
        if ($(this).css("background-color") !== "azure") { // not previously selected
            $(this).css("background-color", "azure");
            $(".reagents button").not(this).css("background-color", "rgb(180, 242, 233)");
        }
        reagentButton = $(this).text();
    })

    $(".products button").click(function () {
        if ($(this).css("background-color") !== "azure") { // not previously selected
            $(this).css("background-color", "azure");
            $(".products button").not(this).css("background-color", "rgb(180, 242, 233)");
        }
        productButton = $(this).text();
    })

    $("#go").click(function () {
        $("#finalResult").html(map.findPathWithDijkstra(reagentButton, productButton));
        //$("#finalResult").toggle("slow")
    });

    $("#reset").click(function() {
        $("#finalResult").html("");
        $(".reagents button").css("background-color", "rgb(180, 242, 233)");
        $(".products button").css("background-color", "rgb(180, 242, 233)");
    })
});
  
var header = document.getElementById("scroll-nav-bar");
var sticky = header.offsetTop;

/*class Vertex {
    #data;
    constructor(data) {
        if (data === null) {
            console.log("Data cannot be null.");
        }
        this.#data = data;
    }

    getData() {
        return this.#data;
    }

    toString() {
        return this.#data.toUpperCase();
    }

    equals(other) {
        if (other !== null && other instanceof Vertex) {
            return this.getData() == other.getData();
        } else {
            return false;
        }
    }

    hashCode() {
        return this.#data.hashCode();
    }
}

class VertexDistance {
    #vertex;
    #distance;

    constructor(vertex, distance) {
        this.#vertex = vertex;
        this.#distance = parseInt(distance);
    }

    getVertex() {
        return this.#vertex;
    }

    getDistance() {
        return this.#distance;
    }

    equals(other) {
        if (other !== null && other instanceof Vertex) {
            return this.getVertex() == other.getVertex() && this.getDistance() == other.getDistance();
        } else {
            return false;
        }
    }

    toString() {
        return "Pair with vertex " + this.#vertex + " and distance " + this.#distance;
    }
    // I didn't implement equals(), hashCode(), or compareTo() methods
}

class Edge {
    #u;
    #v;
    #weight;
    #other;
    constructor(u, v, weight, other) {
        if (u === null || v === null) {
            console.log("Arguments cannot be null.");
        }
        this.#u = u;
        this.#v = v;
        this.#weight = weight;
        this.#other = other;
    }

    getWeight() {
        return this.#weight;
    }

    getU() {
        return this.#u;
    }

    getV() {
        return this.#v;
    }

    getOther() {
        return this.#other;
    }

    equals(other) {
        if (other !== null && other instanceof Edge) {
            return weight === other.weight && this.#u.equals(other.u) && this.#v.equals(other.v);
        } else {
            return false;
        }
    }

    toString() {
        return "Edge from " + this.#u + " to " + this.#v + " with weight " + this.#weight + " and other reagent(s) of " + this.#other;
    }
    // Missing hashCode, compareto, equals
}

class Graph {
    #vertices; // same as private Set<Vertex<T>> vertices
    #edges;
    #adjList;
    #verticesMap;
    constructor(vertices, edges, verticesMap) {
        this.#vertices = new Set(vertices);
        this.#edges = new Set(edges);
        this.#verticesMap = new Map(verticesMap);

        this.#adjList = new Map();

        for (let edge of edges) {
            this.#adjList.set(edge.getU(), []);
        }

        // 30 vertices in adjacencyList

        for (let edge of edges) {
            if (this.#adjList.has(edge.getU())) { // checks if each edge's starting vertex is a key in map
                this.#adjList.get(edge.getU()).push(new VertexDistance(edge.getV(), edge.getWeight()));
            } else {
                console.log("Vertex set must contain all vertices of the graph");
            }
        }
    }

    
    getVertices() {
        return this.#vertices;
    }

    getEdges() {
        return this.#edges;
    }

    getVerticesMap() {
        return this.#verticesMap;
    }

    getAdjList() {
        return this.#adjList;
    }
}

function createDirectedGraph() {
    vertices = new Set();
    edges = new Set();
    verticesMap = new Map();
    populateSets([
        "Alkyl halide--Alkene--1--Base or nucleophile with heat", 
        "Alkane--Alkyl halide--1--X-X with light",
        "1° alkyl halide--Alkene--1--Bulky strong base",
        "2° alkyl halide--Alkene--1--Base and heat",
        "Vicinal dihalide--Alkyne--3--Strong base like NaNH2",
        "Geminal dihalide--Alkyne--3--Strong base like NaNH2",
        "Methanol--Alkyl halide--1--HX",
        "Allylic alcohol--Alkyl halide--1--HX",
        "Benzylic alcohol--Alkyl halide--1--HX",
        "1° alcohol--1° alkyl halide--1--HX and acid-promoted, OR using SOCl2 OR PBr3",
        "2° alcohol--2° alkyl halide--1--HX and acid-promoted, OR using SOCl2 OR PBr3",
        "1° alcohol--Alkene--1--Strong Bronsted acids like H2SO4, heat",
        "1° alcohol--Ether--1--Strong Bronsted acid like H2SO4 but at lower temperature",
        "2° alcohol--Alkene--1--Strong Bronsted acids like H2SO4",
        "3° alcohol--3° alkyl halide--1--HX",
        "3° alcohol--Alkene--1--Strong Bronsted acids like H2SO4 and heat",
        "Epoxide--Halohydrin--1--HX",
        "Epoxide--Anti diol--1--Aqueous acid or H2O",
        "Alkene--Alkyl halide--1--HBr, peroxides (anti-Markov) or HX (Markov)",
        "Alkene--Epoxide--1--Peroxy acid (can also be MCPBA or MMPP)",
        "Alkene--Alkane--1--H2, Pd/C or Pt/C",
        "Alkene--Vicinal dihalide--1--X-X in non-nucleophilic solvent",
        "Alkene--Halohydrin--1--X-X in water",
        "Alkene--2° alcohol--1--H2O, catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)",
        "Alkene--3° alcohol--1--catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)",
        "Alkene--1° alcohol--1--Hg(OAc)2 (Markov) or B2H6 (anti-Markov)",
        "Alkene--Cyclopropane--1--Carbene or carbenoid",
        "Alkene--Syn diol--1--OsO4",
        "Alkyne--Alkane--1--H2 with Pt or Pd/C, Ra-Ni",
        "Alkyne--Alkene (trans)--1--Na or Li and NH3",
        "Alkyne--Alkene (cis)--1--H2 with Lindlar's catalyst",
        "Alkyne--Ketone--1--Mercury(II) salts like HgSO4 with aqueous acid",
        "Alkyne--Aldehyde--1--9-BBN",
        "Alkyne--Dihaloalkene--1--X-X like Br2 or Cl2"
    ], edges, vertices, verticesMap)
    //populateVerticesMap(vertices, verticesMap);
    
    return new Graph(vertices, edges, verticesMap);
}

function populateSets(edgeArr, edges, vertices, verticesMap) {
    edgeArr.forEach(string => {
        param = string.split("--");
        u = new Vertex(param[0]);
        v = new Vertex(param[1]);
        vertices.add(u);
        verticesMap.set(param[0], u);
        edges.add(new Edge(u, v, param[2], param[3]));
    })
}

class PriorityQueue {

    #size = 0;

    constructor() {
        this.values = []
    }
    swap(index1, index2) {
        let temp = this.values[index1];
        this.values[index1] = this.values[index2];
        this.values[index2] = temp;
        return this.values;
    }

    upHeap() {
        let index = this.values.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1)/2);
            if (this.values[parentIndex].getDistance() > this.values[index].getDistance()) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
        return 0;
    }

    add(value) {
        this.values.push(value);
        this.upHeap();
        this.#size++;
        return this.values;
    }

    downHeap() {
        let parentIndex = 0;
        const length = this.values.length;
        const head = this.values[0].getDistance();
        while (true) {
            let leftChildIndex = (2 * parentIndex) + 1;
            let rightChildIndex = (2 * parentIndex) + 2;
            let indexToSwap = null;
            if (leftChildIndex < length) {
                let leftChildDist = this.values[leftChildIndex].getDistance();
                if (leftChildDist < head) {
                    indexToSwap = leftChildIndex;
                }
            }
            if (rightChildIndex < length) {
                let rightChildDist = this.values[rightChildIndex].getDistance();
                if (rightChildDist < head && indexToSwap === null || rightChildDist < this.values[leftChildIndex].getDistance() && indexToSwap !== null) {
                    indexToSwap = rightChildIndex;
                } 
            }
            if (indexToSwap === null) {
                break;
            }
            this.swap(parentIndex, indexToSwap);
            parentIndex = indexToSwap;
        }
    }

    remove() {
        this.swap(0, this.values.length - 1);
        let poppedNode = this.values.pop();
        if (this.values.length > 1) {
            this.downHeap();
        }
        this.#size--;
        return poppedNode;
    }

    isEmpty() {
        if (this.#size === 0) {
            return true;
        } else {
            return false;
        }
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item);
    }

    pop() {
        if (this.items.length === 0) {
            return "Underflow";
        }
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.items.length === 0;
    }

    printStack() {
        str = "";
        for (var i = 0; i < this.items.length; i++) {
            str += this.items[i] + " ";
        }
        return str;
    }
}

function dijkstras(start, graph) {
    if (start === null || graph === null) {
        console.log("All input cannot be null! Start must also exist in graph.");
    }
    visitedSet = new Set();
    pq = new PriorityQueue();
    pq.add(new VertexDistance(start, 0)); // VertexDistance(Vertex, Distance)
    distanceMap = new Map();
    prevMap = new Map();
    distanceMap.set(start, 0);
    prevMap.set(start, start);
    /*for (let vertex of g.getVertices()) {
        if (!vertex.equals(start)) {
            distanceMap.set(vertex, Number.MAX_VALUE);
        }
    }
    adjList = graph.getAdjList();
    for (let list of adjList.values()) {
        for (let vertexDistance of list) {
            vertex = vertexDistance.getVertex();
            if (!vertex.equals(start)) {
                distanceMap.set(vertex, Number.MAX_VALUE);
            }
        }
    }

    while (!pq.isEmpty() && visitedSet.size !== graph.getVertices().size) {
        pqFirst = pq.remove();
        v = pqFirst.getVertex();
        
        if (!visitedSet.has(v)) {
            visitedSet.add(v);
            al = graph.getAdjList();
            //console.log("Adjacency list has vertex: " + adjList.has(v));
            //console.log("SEE THE FOLLOWING: " + adjList.get(v));
            adjVertices = al.get(v); // al is a map, adjVertices is list of vertices
            for (let l of adjVertices) {
                adjVertex = l.getVertex();
                adjVertexDistance = l.getDistance();
                if (!visitedSet.has(adjVertex)) {
                    newDistance = distanceMap.get(v) + adjVertexDistance;
                    oldDistance = distanceMap.get(adjVertex);
                    if (newDistance < oldDistance) {
                        distanceMap.set(adjVertex, newDistance);
                        pq.add(new VertexDistance(adjVertex, newDistance));
                        prevMap.set(adjVertex, v);
                    }
                }
            }
        }
    }
    arr = new Array;
    arr[0] = distanceMap;
    arr[1] = prevMap;
    return arr;
}

function displayEdge(reagent, product, graph) {
    start = graph.getVerticesMap().get(reagent); // start is a Vertex, has data of "reagent"
    console.log("Start vertex is: " + start.toString());
    //console.log(start.equals(new Vertex(start.getData())));
    goal = graph.getVerticesMap().get(product);
    prevMap = dijkstras(start, graph)[1];

    output = reagent;

    stack = new Stack();
    stack.push(goal);
    prev = prevMap.get(goal);
    if (prev !== start) {
        stack.push(prev);
    }
    try {
        while (!prevMap.get(prev).equals(start)) {
            stack.push(prevMap.get(prev));
            prev = prevMap.get(prev);
        }
    } catch {
        return "Path not found!";
    }
    while (!stack.isEmpty()) {
        output += " --> " + stack.pop();
    }
    return output;
}

g = createDirectedGraph();
result = displayEdge("Alkane", "Alkene", g);
console.log(result); // --> "Alkane --> Alkyl halide --> Alkene"

*/

class Graph {
    #edgeParams;
    constructor() {
      this.nodes = [];
      this.adjacencyList = {};
    }

    addNodes(arrNodes) {
        for (let node of arrNodes) {
            this.nodes.push(node);
            this.adjacencyList[node] = [];
        }
    }

    addEdges(arrEdges) {
        for (let edge of arrEdges) {
            this.#edgeParams = edge.split("--");
            //node1 = this.#edgeParams[0];
            //node2 = this.#edgeParams[1];
            //weight = this.#edgeParams[2];
            this.adjacencyList[this.#edgeParams[0]].push({node:this.#edgeParams[1], weight: parseInt(this.#edgeParams[2]), other: this.#edgeParams[3]});
        }
    }

    findPathWithDijkstra(startNode, endNode) {
        if (startNode === undefined || endNode === undefined) {
            return "Please enter valid inputs.";
        }
        let moles = {}; // distance map
        let backtrace = {}; // prevVertices map
        let otherMap = {}; // other reagents map
        let pq = new PriorityQueue();
    
        moles[startNode] = 0;
      
        this.nodes.forEach(node => {
            if (node !== startNode) {
            moles[node] = Infinity
            }
        });
    
        pq.enqueue([startNode, 0]);
    
        while (!pq.isEmpty()) {
            let shortestStep = pq.dequeue();
            let currentNode = shortestStep[0];
            for (let neighbor of this.adjacencyList[currentNode]) {
                let mole = moles[currentNode] + neighbor.weight;
    
                if (mole < moles[neighbor.node]) {
                  moles[neighbor.node] = mole;
                  backtrace[neighbor.node] = currentNode;
                  otherMap[neighbor.node] = neighbor.other;
                  pq.enqueue([neighbor.node, mole]);
                }
            }
        }
        let path = [endNode];
        let lastStep = endNode;
        while(lastStep !== startNode) {
            path.unshift("------" + otherMap[lastStep] + "------>")
            path.unshift(backtrace[lastStep]) // unshift adds to front of array
            if (path[0] === undefined) {
                return "Path not found!";
            }
            lastStep = backtrace[lastStep]
        }
        return `${path.join(" ")}`
    }
}

class PriorityQueue {
    constructor() {
      this.collection = [];
    }
    enqueue(element){
        if (this.isEmpty()){ 
          this.collection.push(element);
        } else {
          let added = false;
          for (let i = 1; i <= this.collection.length; i++){
            if (element[1] < this.collection[i-1][1]){ 
              this.collection.splice(i-1, 0, element);
              added = true;
              break;
            }
          }
          if (!added){
              this.collection.push(element);
          }
        }
    };
    dequeue() {
        let value = this.collection.shift();
        return value;
      };
      isEmpty() {
        return (this.collection.length === 0) 
      };
}


let map = new Graph();
map.addNodes(["Alkyl halide", "Alkane", "Vicinal dihalide", "Geminal dihalide", "Methanol", "Alcohol", "Epoxide", "Alkene", "Alkyne", "Cyclopropane", "Chloroform", "Diiodomethane", "Alkylborane", "Conjugated diene", "Ether", "Halohydrin", "Diol", "Carboxylic acid", "Dichlorocarbene", "Carbenoid", "Cyclohexene", "Alkynide ion", "Extended alkyne"]);
map.addEdges(["Alkyl halide--Alkene--1--base or nucleophile with heat", "Alkane--Alkyl halide--1--X-X with light", "Alcohol--Alkyl halide--1--HX", "Epoxide--Halohydrin--1--HX", "Epoxide--Diol--1--aqueous acid or H2O", "Alkene--Alkyl halide--1--HBr, peroxides (anti-Markov) or HX (Markov)", "Alkene--Epoxide--1--Peroxy acid or MCPBA or MMPP", "Alkene--Alkane--1--H2 with Pt/C or Pd/C", "Alkene--Vicinal dihalide--1--X-X in non-nucleophilic solvent", "Alkene--Halohydrin--1--X-X in water", "Alkene--Alcohol--1--H2O, catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)", "Alkene--Cyclopropane--1--carbene or carbenoid", "Alkene--Diol--1--OsO4", "Alkyne--Alkane--1--H2 with Pt/C or Pd/C, Ra-Ni", "Vicinal dihalide--Alkyne--3--strong base like NaNH2", "Geminal dihalide--Alkyne--3--strong base like NaNH2", "Methanol--Alkyl halide--1--HX", "Alkylborane--Alkane--1--Acetic acid and heat", "Alkyne--Carboxylic acid--1--Hot KMnO4, OH, H3O+ or O3", "Chloroform--Dichlorocarbene--1--Strong bases like tert-butoxide or NaNH2", "Diiodomethane--Carbenoid--1--Zn(Cu)", "Conjugated diene--Alkene--1--H-X", "Conjugated diene--Cyclohexene--1--Dienophile", "Halohydrin--Epoxide--1--Strong base or sodium metal", "Alkyne--Alkynide ion--1--Strong base like NaNH2", "Alkynide ion--Extended alkyne--1--HX", "Alkyne--Alkene--1--H2 with LC or Na reduction"]);
console.log(map.findPathWithDijkstra("Alkane", "Cyclopropane"));





