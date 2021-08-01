import javafx.application.Application;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.Label;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.StackPane;
import javafx.stage.Stage;
import javafx.scene.control.Button;
import javafx.scene.layout.HBox;
import javafx.scene.control.TextField;
import javafx.scene.text.Text;
import javafx.geometry.Pos;

// javac --module-path javafx-sdk-11.0.2/lib/ --add-modules javafx.controls OrgoSolver.java
// java --module-path javafx-sdk-11.0.2/lib/ --add-modules javafx.controls OrgoSolver

public class OrgoSolver extends Application {
  @Override // Override the start method in the Application class
  public void start(Stage primaryStage) {
    // Create a border pane 
    BorderPane pane = new BorderPane();

    // Place nodes in the pane
    pane.setTop(new CustomPane("Top")); 
    pane.setRight(new CustomPane("Right"));
    pane.setBottom(new CustomPane("Bottom"));
    pane.setLeft(new CustomPane("Left"));
    pane.setCenter(hBoxMaker()); 
    
    // Create a scene and place it in the stage
    Scene scene = new Scene(pane);
    primaryStage.setTitle("ShowBorderPane"); // Set the stage title
    primaryStage.setScene(scene); // Place the scene in the stage
    primaryStage.show(); // Display the stage
  }

  private HBox hBoxMaker() {
    HBox hBox = new HBox(15);
    hBox.setPadding(new Insets(15, 5, 5, 5));
    hBox.setAlignment(Pos.CENTER);

    // Create label for product
    Label l = new Label("Product: alkane");

    // Create a text field for starting reagent
    TextField t = new TextField();
    t.setPromptText("Enter a starting reagent here");
    t.setFocusTraversable(false);

    // Enter button for text field
    Button enterBtn = new Button();
    enterBtn.setText("Enter");
    enterBtn.setOnAction(e -> {
        System.out.println("Clicked");
    });

    hBox.getChildren().addAll(l, t, enterBtn);
    return hBox;
  }
  
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
    setStyle("-fx-border-color: red");
    setPadding(new Insets(11.5, 12.5, 13.5, 14.5));
  }
  
}
