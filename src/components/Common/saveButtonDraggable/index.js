import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import './styles.css';

const SaveButtonDraggable = ({ children }) => {
  useEffect(() => {
    try {
      const ball = $("#draggable-section");

      const containmentBounds = {
        left: 250,
        top: 65,
        right: 20,
        bottom: 50,
      };

      ball.draggable({
        containment: [
          containmentBounds.left,
          containmentBounds.top,
          window.innerWidth - containmentBounds.right,
          window.innerHeight - containmentBounds.bottom,
        ],
        scroll: false
      });

      return () => {
        ball.draggable("destroy");
      };
    } catch (error) {
      console.error("Error in SaveButtonDraggable useEffect:", error);
    }
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
