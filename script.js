$(document).ready(function () {

    var reagentButton;
    var productButton;
    var finalReagent;
    var finalProduct;
    var addConsiderationR = null;
    var addConsiderationP = null;
    var finalProductNew = null;

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

    // for reagent alcohol/HX settings:

    $(".primarysec").click(function() { // enable buttons
        $(".structural-reagent button:contains('1°')").prop("disabled", false);
        $(".structural-reagent button:contains('2°')").prop("disabled", false);
        $(".structural-reagent button:contains('3°')").prop("disabled", false);
    })

    $(".structural-reagent button").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".structural-reagent button").not(this).removeClass("active").addClass("inactive");
        addConsiderationR = $(this).text();
    })

    $(".reagents button").not(".primarysec").click(function() {
        $(".structural-reagent button:contains('1°')").prop("disabled", true);
        $(".structural-reagent button:contains('2°')").prop("disabled", true);
        $(".structural-reagent button:contains('3°')").prop("disabled", true);
        addConsiderationR = null;
    })

    $("#alcoholreagent").click(function() {
        $(".structural-reagent button:contains('Allylic')").prop("disabled", false);
        $(".structural-reagent button:contains('Benzylic')").prop("disabled", false);
        $(".structural-reagent button:contains('Propargylic')").prop("disabled", false);
    })

    $(".reagents button").not("#alcoholreagent").click(function() {
        $(".structural-reagent button:contains('Allylic')").prop("disabled", true);
        $(".structural-reagent button:contains('Benzylic')").prop("disabled", true);
        $(".structural-reagent button:contains('Propargylic')").prop("disabled", true);
        addConsiderationR = null;
    })

    // for product alcohol/HX settings:

    $(".primarysecprod").click(function() {
        $(".structural-product button:contains('1°')").prop("disabled", false);
        $(".structural-product button:contains('2°')").prop("disabled", false);
        $(".structural-product button:contains('3°')").prop("disabled", false);
    })

    $(".structural-product button:contains('1°')").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".structural-product button").not(this).removeClass("active").addClass("inactive");
        addConsiderationP = $(this).text();
    })

    $(".structural-product button:contains('2°')").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".structural-product button").not(this).removeClass("active").addClass("inactive");
        addConsiderationP = $(this).text();
    })

    $(".structural-product button:contains('3°')").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".structural-product button").not(this).removeClass("active").addClass("inactive");
        addConsiderationP = $(this).text();
    })

    $(".products button").not(".primarysecprod").click(function() {
        $(".structural-product button:contains('1°')").prop("disabled", true);
        $(".structural-product button:contains('2°')").prop("disabled", true);
        $(".structural-product button:contains('3°')").prop("disabled", true);
        addConsiderationP = null;
    })

    // for Zaitsev or Hofmann product

    $("#alkene").click(function() { // enable Zaitsev and Hofmann options
        $(".regiochemistry button:contains('Zaitsev')").prop("disabled", false);
        $(".regiochemistry button:contains('Hofmann')").prop("disabled", false);
    })

    $(".regiochemistry button:contains('Zaitsev')").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".regiochemistry button").not(this).removeClass("active").addClass("inactive");
        finalProductNew = "Zaitsev product";
    })

    $(".regiochemistry button:contains('Hofmann')").click(function() {
        $(this).removeClass("inactive").addClass("active");
        $(".regiochemistry button").not(this).removeClass("active").addClass("inactive");
        finalProductNew = "Hofmann product";
    })

    $(".products button").not("#alkene").click(function() { // enable Zaitsev and Hofmann options
        $(".regiochemistry button:contains('Zaitsev')").prop("disabled", true);
        $(".regiochemistry button:contains('Hofmann')").prop("disabled", true);
        finalProductNew = null;
    })

    // for generating result with Go button

    $("#goBtn").click(function () {
        if (addConsiderationR !== null) {
            finalReagent = addConsiderationR + ' ' + reagentButton;
        } else {
            finalReagent = reagentButton;
        }
        if (addConsiderationP !== null) {
            finalProduct = addConsiderationP + " " + productButton;
        } else if (finalProductNew !== null) {
            finalProduct = finalProductNew;
        } else {
            finalProduct = productButton;
        }
        $("#finalResult").html(map.findPathWithDijkstra(finalReagent, finalProduct));
        //$("#finalResult").toggle("slow")
    });

    $("#resetBtn").click(function() {
        $("#finalResult").html("");
        $(".reagents button").css("background-color", "rgb(180, 242, 233)");
        $(".products button").css("background-color", "rgb(180, 242, 233)");
        $(".considerations button").prop("disabled", true);
        $(".considerations button").removeClass("active").addClass("inactive");
        finalProductNew = null;
        addConsiderationP = null;
        addConsiderationR = null;
    })
});

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
map.addNodes(["Alkyl halide", "Alkane", "Vicinal dihalide", "Geminal dihalide", "Methanol", "Alcohol", "Epoxide", "Alkene", "Alkyne", "Cyclopropane", "Chloroform", "Diiodomethane", "Alkylborane", "Conjugated diene", "Ether", "Halohydrin", "Diol", "Carboxylic acid", "Dichlorocarbene", "Carbenoid", "Cyclohexene", "Alkynide ion", "Extended alkyne", "1° Alcohol", "1° Alkyl halide", "2° Alcohol", "2° Alkyl halide", "3° Alcohol", "3° Alkyl halide", "Zaitsev product", "Hofmann product", "Kinetic product", "Thermodynamic product", "Syn", "Anti", "Allylic Alcohol", "Benzylic Alcohol", "Propargylic Alcohol", "Sulfonate ester"]);
map.addEdges([
    "Alkyl halide--Alkene--1--base or nucleophile with heat", 
    "Alkane--Alkyl halide--1--X-X with light", 
    "Alcohol--Alkyl halide--1--HX", 
    "Epoxide--Halohydrin--1--HX", 
    "Epoxide--Diol--1--aqueous acid or H2O", 
    "Alkene--Alkyl halide--1--HBr, peroxides (anti-Markov) or HX (Markov)", 
    "Alkene--Epoxide--1--Peroxy acid or MCPBA or MMPP", 
    "Alkene--Alkane--1--H2 with Pt/C or Pd/C", 
    "Alkene--Vicinal dihalide--1--X-X in non-nucleophilic solvent", 
    "Alkene--Halohydrin--1--X-X in water", 
    "Alkene--Alcohol--1--H2O, catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)", 
    "Alkene--Cyclopropane--1--carbene or carbenoid", 
    "Alkene--Diol--1--OsO4", 
    "Alkyne--Alkane--1--H2 with Pt/C or Pd/C, Ra-Ni", 
    "Vicinal dihalide--Alkyne--3--strong base like NaNH2", 
    "Geminal dihalide--Alkyne--3--strong base like NaNH2", 
    "Methanol--Alkyl halide--1--HX", "Alkylborane--Alkane--1--Acetic acid and heat",
    "Alkyne--Carboxylic acid--1--Hot KMnO4, OH, H3O+ or O3", 
    "Chloroform--Dichlorocarbene--1--Strong bases like tert-butoxide or NaNH2", 
    "Diiodomethane--Carbenoid--1--Zn(Cu)", 
    "Conjugated diene--Alkene--1--H-X", 
    "Conjugated diene--Cyclohexene--1--Dienophile", 
    "Halohydrin--Epoxide--1--Strong base or sodium metal", 
    "Alkyne--Alkynide ion--1--Strong base like NaNH2", 
    "Alkynide ion--Extended alkyne--1--HX", 
    "Alkyne--Alkene--1--H2 with LC or Na reduction", 
    "1° Alcohol--1° Alkyl halide--1--SOCl2 for chloride, PBr3 for bromide, or HX", 
    "1° Alkyl halide--Hofmann product--1--Strong bulky base with heat", 
    "2° Alkyl halide--Zaitsev product--1--Weak nucleophile with heat", 
    "2° Alkyl halide--Zaitsev product--1--Strong base with heat", 
    "3° Alkyl halide--Zaitsev product--1--Weak or strong base with heat", 
    "3° Alkyl halide--Hofmann product--1--Strong bulky base with heat or base w/o antiperiplanar orientation", 
    "2° Alkyl halide--Hofmann product--1--Strong bulky base with heat or base w/o antiperiplanar orientation", 
    "Allylic Alcohol--Alkyl halide--1--HX", "Benzylic Alcohol--Alkyl halide--1--HX", 
    "Propargylic Alcohol--Alkyl halide--1--HX", 
    "1° Alcohol--Alkyl halide--1--HX and acid-promoted", 
    "1° Alcohol--Sulfonate ester--1--Sulfonyl chloride", 
    "Alcohol--Sulfonate ester--1--Sulfonyl chloride", 
    "1° Alcohol--Ether--1--Strong Bronsted acids at lower temperature", 
    "1° Alcohol--Alkene--1--Strong conc. acid and heat", 
    "1° Alcohol--Zaitsev product--1--Strong conc. acid and heat", 
    "2° Alcohol--2° Alkyl halide--1--SoCl2 for chloride or PBr3 for bromide", 
    "2° Alcohol--Alkene--1--Strong conc. acid and heat", 
    "2° Alcohol--Zaitsev product--1--Strong conc. acid and heat", 
    "3° Alcohol--Zaitsev product--1--Strong conc. acid and heat", 
    "3° Alcohol--Alkene--1--Strong conc. acid and heat"]);
console.log(map.findPathWithDijkstra("1° Alcohol", "1° Alkyl halide"));





