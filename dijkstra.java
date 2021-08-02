import java.util.Set;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.HashSet;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Stack;
import java.util.LinkedHashSet;

public class dijkstra {
    /**
     * Finds the single-source shortest distance between the start vertex and
     * all vertices given a weighted graph (you may assume non-negative edge
     * weights).
     *
     * Return a map of the shortest distances such that the key of each entry
     * is a node in the graph and the value for the key is the shortest distance
     * to that node from start, or Integer.MAX_VALUE (representing
     * infinity) if no path exists.
     *
     * You may import/use java.util.PriorityQueue,
     * java.util.Map, and java.util.Set and any class that
     * implements the aforementioned interfaces, as long as your use of it
     * is efficient as possible.
     *
     * You should implement the version of Dijkstra's where you use two
     * termination conditions in conjunction.
     *
     * 1) Check if all of the vertices have been visited.
     * 2) Check if the PQ is empty yet.
     *
     * DO NOT modify the structure of the graph. The graph should be unmodified
     * after this method terminates.
     *
     * @param <T>   the generic typing of the data
     * @param start the vertex to begin the Dijkstra's on (source)
     * @param graph the graph we are applying Dijkstra's to
     * @return a map of the shortest distances from start to every
     * other node in the graph
     * @throws IllegalArgumentException if any input is null, or if start
     *                                  doesn't exist in the graph.
     */
    public static <T> ArrayList<Map> dijkstras(Vertex<T> start,
                                                        Graph<T> graph) {
        if (start == null || graph == null || !graph.getVertices().contains(start)) {
            throw new IllegalArgumentException("All input cannot be null! Start must also exist in graph.");
        }
        Set<Vertex<T>> visitedSet = new HashSet<>();
        PriorityQueue<VertexDistance<T>> pq = new PriorityQueue<>();
        pq.add(new VertexDistance<>(start, 0));
        Map<Vertex<T>, Integer> distanceMap = new HashMap<>();
        Map<Vertex<T>, Vertex<T>> prevMap = new HashMap<>(); // list for keeping track of last visited node
        distanceMap.put(start, 0);
        prevMap.put(start, start);
        for (Vertex<T> v : graph.getVertices()) {
            //System.out.println(v);
            if (!v.equals(start)) {
                distanceMap.put(v, Integer.MAX_VALUE);
            }
        }
        while (!pq.isEmpty() && visitedSet.size() != graph.getVertices().size()) {
            VertexDistance<T> pqFirst = pq.remove(); // dequeue from priority queue
            Vertex<T> v = pqFirst.getVertex(); // v is our current index
            if (!visitedSet.contains(v)) {
                visitedSet.add(v); // visit v
                for (VertexDistance<T> l : graph.getAdjList().get(v)) {
                    Vertex<T> adjVertex = l.getVertex();
                    int adjVertexDistance = l.getDistance();
                    if (!visitedSet.contains(adjVertex)) {
                        int newDistance = distanceMap.get(v) + adjVertexDistance; // new cumulative path cost
                        if (distanceMap.get(adjVertex) > newDistance) { // newDistance is cheaper cost
                            distanceMap.put(adjVertex, newDistance);
                            pq.add(new VertexDistance<>(adjVertex, newDistance));
                            prevMap.put(adjVertex, v); // add new vertex and its starting point to prevMap
                        }
                    }
                }
            }
        }
        ArrayList<Map> arr = new ArrayList<>();
        arr.add(distanceMap);
        arr.add(prevMap);
        return arr;
    }

    public static <T> String displayEdge(String reagent, String product, Graph<T> graph) {
        Vertex<T> start = graph.getVerticesMap().get(reagent);
        Vertex<T> goal = graph.getVerticesMap().get(product);
        Map<Vertex<T>, Vertex<T>> prevMap = (dijkstras(start, graph)).get(1);

        String output = reagent;

        Stack<Vertex<T>> stack = new Stack<>();
        stack.push(goal);
        Vertex<T> prev = prevMap.get(goal);
        if (prev != start) {
            stack.push(prev);
        }
        try {
            while (!prevMap.get(prev).equals(start)) { // while the previous node's previous is not the start, continue pushing
                stack.push(prevMap.get(prev));
                prev = prevMap.get(prev);
            }
        } catch (NullPointerException n) {
            return ("Path not found!");
        }
        while (!stack.isEmpty()) { // add edges instead? Change toString method for edge to include reagents
            output += " --> " +  stack.pop();
        }
        return output;
    }

    /**
     * Creates a directed graph.
     * The graph is depicted in the pdf.
     *
     * @return the completed graph
     */
    public static Graph<String> createDirectedGraph() {
        Set<Vertex<String>> vertices = new HashSet<>();
        Map<String, Vertex<String>> verticesMap = new HashMap<>();

        // Instantiate all the reagents and add them to the vertex set
        Vertex<String> alkylHalide = new Vertex<>("Alkyl halide");
        addVertex(alkylHalide, alkylHalide.getData(), vertices, verticesMap);
        Vertex<String> primaryHX = new Vertex<>("1° alkyl halide");
        addVertex(primaryHX, primaryHX.getData(), vertices, verticesMap);
        Vertex<String> secondaryHX = new Vertex<>("2° alkyl halide");
        addVertex(secondaryHX, secondaryHX.getData(), vertices, verticesMap);
        Vertex<String> tertiaryHX = new Vertex<>("3° alkyl halide");
        addVertex(tertiaryHX, tertiaryHX.getData(), vertices, verticesMap);
        Vertex<String> alkane = new Vertex<>("Alkane");
        addVertex(alkane, alkane.getData(), vertices, verticesMap);
        Vertex<String> vicinalDihalide = new Vertex<>("Vicinal dihalide");
        addVertex(vicinalDihalide, vicinalDihalide.getData(), vertices, verticesMap);
        Vertex<String> geminalDihalide = new Vertex<>("Geminal dihalide");
        addVertex(geminalDihalide, geminalDihalide.getData(), vertices, verticesMap);
        Vertex<String> methanol = new Vertex<>("Methanol");
        addVertex(methanol, methanol.getData(), vertices, verticesMap);
        Vertex<String> allylicAlcohol = new Vertex<>("Allylic alcohol");
        addVertex(allylicAlcohol, allylicAlcohol.getData(), vertices, verticesMap);
        Vertex<String> benzylicAlcohol = new Vertex<>("Benzylic alcohol");
        addVertex(benzylicAlcohol, benzylicAlcohol.getData(), vertices, verticesMap);
        Vertex<String> primaryAlcohol = new Vertex<>("1° alcohol");
        addVertex(primaryAlcohol, primaryAlcohol.getData(), vertices, verticesMap);
        Vertex<String> secondaryAlcohol = new Vertex<>("2° alcohol");
        addVertex(secondaryAlcohol, secondaryAlcohol.getData(), vertices, verticesMap);
        Vertex<String> tertiaryAlcohol = new Vertex<>("3° alcohol");
        addVertex(tertiaryAlcohol, tertiaryAlcohol.getData(), vertices, verticesMap);
        Vertex<String> epoxide = new Vertex<>("Epoxide");
        addVertex(epoxide, epoxide.getData(), vertices, verticesMap);
        Vertex<String> alkene = new Vertex<>("Alkene");
        addVertex(alkene, alkene.getData(), vertices, verticesMap);
        Vertex<String> alkyne = new Vertex<>("Alkyne");
        addVertex(alkyne, alkyne.getData(), vertices, verticesMap);
        Vertex<String> carbene = new Vertex<>("Carbene");
        Vertex<String> cyclopropane = new Vertex<>("Cyclopropane");
        addVertex(cyclopropane, cyclopropane.getData(), vertices, verticesMap);
        Vertex<String> chloroform = new Vertex<>("Chloroform");
        Vertex<String> diiodomethane = new Vertex<>("Diiodomethane");
        Vertex<String> alkylborane = new Vertex<>("Alkylborane");
        Vertex<String> conjugatedDiene = new Vertex<>("Conjugated diene");
        Vertex<String> dialkylEther = new Vertex<>("Dialkyl ether");
        Vertex<String> halohydrin = new Vertex<>("Halohydrin");
        addVertex(halohydrin, halohydrin.getData(), vertices, verticesMap);
        Vertex<String> ether = new Vertex<>("Ether");
        addVertex(ether, ether.getData(), vertices, verticesMap);
        Vertex<String> antiDiol = new Vertex<>("Anti diol");
        addVertex(antiDiol, antiDiol.getData(), vertices, verticesMap);
        Vertex<String> synDiol = new Vertex<>("Syn diol");
        addVertex(synDiol, synDiol.getData(), vertices, verticesMap);

        // Instantiate edges with their weights (molar equivalents) and other reagents. Or do the weights
        // stand for 1 each, where 1 edge is 1 step?

        // Drawbacks: parallel edges like in the case of converting alcohol to alkyl halide.
        // Not enough specificity about control for stereochemistry or regioselectivity
        Set<Edge<String>> edges = new LinkedHashSet<>();
        edges.add(new Edge<>(alkylHalide, alkene, Integer.parseInt("1"), "Base or nucleophile with heat"));
        edges.add(new Edge<>(primaryHX, alkene, Integer.parseInt("1"), "Bulky strong base"));
        edges.add(new Edge<>(secondaryHX, alkene, Integer.parseInt("1"), "Weak nucleophiles with heat"));
        edges.add(new Edge<>(tertiaryHX, alkene, Integer.parseInt("1"), "Base and heat"));
        edges.add(new Edge<>(alkane, alkylHalide, Integer.parseInt("1"), "X-X with light"));
        edges.add(new Edge<>(vicinalDihalide, alkyne, Integer.parseInt("1"),
                "Strong base like NaNH2 (3 equiv)"));
        edges.add(new Edge<>(geminalDihalide, alkyne, Integer.parseInt("1"),
                "Strong base like NaNH2 (3 equiv)"));
        edges.add(new Edge<>(methanol, alkylHalide, Integer.parseInt("1"), "HX"));
        edges.add(new Edge<>(allylicAlcohol, alkylHalide, Integer.parseInt("1"), "HX"));
        edges.add(new Edge<>(benzylicAlcohol, alkylHalide, Integer.parseInt("1"), "HX"));
        edges.add(new Edge<>(primaryAlcohol, primaryHX, Integer.parseInt("1"),
                "HX and acid-promoted, OR using SOCl2 OR PBr3"));
        edges.add(new Edge<>(secondaryAlcohol, secondaryHX, Integer.parseInt("1"),
                "HX and acid-promoted, OR using SOCl2 OR PBr3"));
        edges.add(new Edge<>(primaryAlcohol, alkene, Integer.parseInt("1"),
                "Strong Bronsted acids like H2SO4, heat"));
        edges.add(new Edge<>(primaryAlcohol, ether, Integer.parseInt("1"),
                "Strong Bronsted acid like H2SO4 but at lower temperature"));
        edges.add(new Edge<>(secondaryAlcohol, alkene, Integer.parseInt("1"),
                "Strong Bronsted acids like H2SO4"));
        edges.add(new Edge<>(tertiaryAlcohol, tertiaryHX, Integer.parseInt("1"), "HX"));
        edges.add(new Edge<>(tertiaryAlcohol, alkene, Integer.parseInt("1"),
                "Strong Bronsted acids like H2SO4 and heat"));
        edges.add(new Edge<>(epoxide, halohydrin, Integer.parseInt("1"), "HX"));
        edges.add(new Edge<>(epoxide, antiDiol, Integer.parseInt("1"), "Aqueous acid or H2O"));
        edges.add(new Edge<>(alkene, alkylHalide, Integer.parseInt("1"),
                "HBr, peroxides (anti-Markov) or HX (Markov)"));
        edges.add(new Edge<>(alkene, epoxide, Integer.parseInt("1"),
                "Peroxy acid (can also be MCPBA or MMPP)"));
        edges.add(new Edge<>(alkene, alkane, Integer.parseInt("1"), "H2, Pd/C or Pt/C"));
        edges.add(new Edge<>(alkene, vicinalDihalide, Integer.parseInt("1"),
                "X-X in non-nucleophilic solvent"));
        edges.add(new Edge<>(alkene, halohydrin, Integer.parseInt("1"), "X-X in water"));
        edges.add(new Edge<>(alkene, secondaryAlcohol, Integer.parseInt("1"),
                "H2O, catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)"));
        edges.add(new Edge<>(alkene, tertiaryAlcohol, Integer.parseInt("1"),
                "H2O, catalytic HA or Hg(OAc)2 (Markov) or B2H6 (anti-Markov)"));
        edges.add(new Edge<>(alkene, primaryAlcohol, Integer.parseInt("1"),
                "Hg(OAc)2 if it's Markov, or B2H26 if it's anti-Markov"));
        edges.add(new Edge<>(alkene, cyclopropane, Integer.parseInt("1"), "Carbene or carbenoid"));
        edges.add(new Edge<>(alkene, synDiol, Integer.parseInt("1"), "OsO4"));
        edges.add(new Edge<>(alkyne, alkane, Integer.parseInt("1"), "H2 with Pt or Pd/C, Ra-Ni"));

        return new Graph<>(vertices, edges, verticesMap);
    }

    public static <T> void addVertex(Vertex<T> v, T data, Set<Vertex<T>> s, Map<T, Vertex<T>> m) {
        s.add(v);
        m.put(data, v);
    }

    /*public static void main(String[] args) {
        Graph<String> g = createDirectedGraph();
        System.out.println(displayEdge("Alkene", "Alkane", g));
        System.out.println(displayEdge("Secondary alcohol", "Alkane", g));
        System.out.println(displayEdge("Epoxide", "Secondary alcohol", g));
    }*/
}