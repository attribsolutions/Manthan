import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import './styles.css';

const SaveButtonDraggable = ({ children }) => {

  useEffect(() => {
    
    const containmentBounds = {
      left: 250,
      top: 65,
      right: 20,
      bottomOffset: 50, // Offset from the bottom of the page
    };
    
    const calculateBottomConstraint = () => {
      const windowHeight = $(window).height();
      return windowHeight - containmentBounds.bottomOffset;
    };
    const ball = $('#draggable-section'); // Replace with your actual ball element

    ball.draggable({
      containment: [
        containmentBounds.left,
        containmentBounds.top,
        window.innerWidth - containmentBounds.right,
        calculateBottomConstraint(),
      ],
    });
    
    // Update containment when the window is resized
    $(window).resize(() => {
      ball.draggable('option', 'containment', [
        containmentBounds.left,
        containmentBounds.top,
        window.innerWidth - containmentBounds.right,
        calculateBottomConstraint(),
      ]);
    });
    return () => {
      // Clean up event handlers and draggable functionality
      ball.draggable("destroy");
    };
  }, []);

  return (
    <div className="row save-Btn">
      <div id="draggable-section">
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SaveButtonDraggable;
