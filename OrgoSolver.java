import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;
import javafx.scene.control.Button;
import javafx.scene.layout.HBox;
import javafx.scene.layout.VBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.geometry.Pos;
import java.util.ArrayList;
import javafx.scene.Group;
import java.util.Stack;
import javafx.scene.paint.Color;

// javac --module-path javafx-sdk-11.0.2/lib/ --add-modules javafx.controls OrgoSolver.java
// java --module-path javafx-sdk-11.0.2/lib/ --add-modules javafx.controls OrgoSolver

public class OrgoSolver extends Application {

  private String[] toolkit = new String[]{"Alkyl halide", "1° alkyl halide", "2° alkyl halide", "3° alkyl halide", "Alkane", "Vicinal dihalide", "Geminal dihalide", "Methanol", "Allylic alcohol", "Benzylic alcohol", "1° alcohol", "2° alcohol", "3° alcohol", "Epoxide", "Alkene", "Alkyne", "Halohydrin", "Cyclopropane", "Ether", "Anti diol", "Syn diol"};
  private Stack<Button> buttons = new Stack<Button>();
  private String reagent = "";
  private String product = "";
  private Label displayAnswer = new Label("Synthesis steps: [Select a starting reagent and final product. See the path to get there!]");

  @Override // Override the start method in the Application class
  public void start(Stage primaryStage) {
    // Create a border pane 
    BorderPane pane = new BorderPane();

    // Place nodes in the pane
    pane.setTop(new CustomPane("ORGOSOLVER")); 

    pane.setBottom(vBoxMaker());
    
    pane.setLeft(reagentsMaker()); 
    pane.setRight(productsMaker());
    
    // Create a scene and place it in the stage
    Scene scene = new Scene(pane);
    primaryStage.setTitle("ORGOSOLVER"); // Set the stage title
    primaryStage.setScene(scene); // Place the scene in the stage
    primaryStage.setMinWidth(950);
    primaryStage.setMinHeight(500);
    scene.getStylesheets().add("styles.css");
    primaryStage.show(); // Display the stage
  }

  private VBox reagentsMaker() {
    VBox vBox = new VBox(15);
    vBox.setAlignment(Pos.CENTER);

    Text title = new Text("Reagents:");

    vBox.getChildren().addAll(title, reagentsButtonsMaker());
    return vBox;
  }

  private VBox productsMaker() {
    VBox vBox = new VBox(15);
    vBox.setAlignment(Pos.CENTER);

    Text title = new Text("Products:");

    vBox.getChildren().addAll(title, productsButtonsMaker());
    return vBox;
  }

  private VBox vBoxMaker() {
    VBox vBox = new VBox(15);
    vBox.setPadding(new Insets(15, 5, 5, 5));
    vBox.setAlignment(Pos.CENTER);

    // Enter button for text field
    Button enterBtn = new Button();
    enterBtn.setText("Enter");
    enterBtn.setOnAction(e -> {
        Graph<String> g = dijkstra.createDirectedGraph();
        displayAnswer.setText("Synthesis steps: " + dijkstra.displayEdge(reagent, product, g));
    });

    CustomPane t = new CustomPane("Be on the lookout for further updates! Regioselectivity, stereochem, etc. Will add mechanism names and reagents as well. - Jennifer D.");

    vBox.getChildren().addAll(enterBtn, displayAnswer, t);
    return vBox;
  }


  private VBox reagentsButtonsMaker() {
    VBox vBox = new VBox(15);
    vBox.setPadding(new Insets(15, 5, 5, 5));
    vBox.setAlignment(Pos.CENTER);

    for (String tool : toolkit) {
      buttons.push(new Button(tool));
    }

    for (Button b : buttons) {
      b.setOnAction(e -> {
        b.getStyleClass().removeAll("button, focus"); 
        b.getStyleClass().add("button");
        reagent = b.getText();
        System.out.println(reagent);
        displayAnswer.setText("Synthesis steps: ");
      });
    }

    HBox row1 = new HBox(15);
    HBox row2 = new HBox(15);
    HBox row3 = new HBox(15);
    HBox row4 = new HBox(15);
    HBox row5 = new HBox(15);
    HBox row6 = new HBox(15);
    HBox row7 = new HBox(15);
    HBox row8 = new HBox(15);

    HBox[] rows = new HBox[]{row1, row2, row3, row4, row5, row6, row7, row8};


    for (HBox row : rows) {
      int i = 1;
      while (!buttons.isEmpty() && i < 4) {
        row.getChildren().add(buttons.pop());
        i++;
      }
      vBox.getChildren().add(row);
    }

    return vBox;
  }

    private VBox productsButtonsMaker() {
    VBox vBox = new VBox(15);
    vBox.setPadding(new Insets(15, 5, 5, 5));
    vBox.setAlignment(Pos.CENTER);

    for (String tool : toolkit) {
      buttons.push(new Button(tool));
    }

    for (Button b : buttons) {
      b.setOnAction(e -> {
        b.getStyleClass().removeAll("button, focus"); 
        b.getStyleClass().add("button");
        product = b.getText();
        System.out.println(product);
        displayAnswer.setText("Synthesis steps: ");
      });
    }

    HBox row1 = new HBox(15);
    HBox row2 = new HBox(15);
    HBox row3 = new HBox(15);
    HBox row4 = new HBox(15);
    HBox row5 = new HBox(15);
    HBox row6 = new HBox(15);
    HBox row7 = new HBox(15);
    HBox row8 = new HBox(15);

    HBox[] rows = new HBox[]{row1, row2, row3, row4, row5, row6, row7, row8};


    for (HBox row : rows) {
      int i = 1;
      while (!buttons.isEmpty() && i < 4) {
        row.getChildren().add(buttons.pop());
        i++;
      }
      vBox.getChildren().add(row);
    }

    return vBox;
  }

  /*private HBox hBoxMaker() {
    HBox hBox = new HBox(15);
    hBox.setPadding(new Insets(15, 5, 5, 5));
    hBox.setAlignment(Pos.CENTER);

    // Create label for product
    Label l = new Label("Product: ");

    // Create a text field for starting reagent
    TextField t = new TextField();
    t.setPromptText("Enter a starting reagent");
    t.setFocusTraversable(false);

    // Enter button for text field
    Button enterBtn = new Button();
    enterBtn.setText("Enter");
    enterBtn.setOnAction(e -> {
        System.out.println("Clicked");
    });

    hBox.getChildren().addAll(l, t, enterBtn);
    return hBox;
  }*/
  
   /**
   * The main method is only needed for the IDE with limited
   * JavaFX support. Not needed for running from the command line.
   */
  public static void main(String[] args) {
    launch(args);
  }


} 

// Define a custom pane to hold a label in the center of the pane
class CustomPane extends StackPane {
  public CustomPane(String title) {
    getChildren().add(new Label(title));
    setStyle("-fx-border-color: green");
    setPadding(new Insets(11.5, 12.5, 13.5, 14.5));
  }

  public CustomPane() {
    setStyle("-fx-border-color: green");
    setPadding(new Insets(11.5, 12.5, 13.5, 14.5));
    setMaxWidth(50);
  }
  
}
