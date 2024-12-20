import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import './dragbutton.css';
import { mode } from "../../../routes";

const SaveButtonDraggable = ({ children }) => {
  
  let pageMode;

  if (Array.isArray(children)) {
    pageMode = children[0].props.pageMode;
  }
  else if (typeof children === 'object') {
    pageMode = children.props.pageMode;
  }
  const canNotDragBody = (pageMode === mode.view)

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

  if (canNotDragBody) {
    return null;
  }

  return (
    <div id='save-btn-container' className="row">
      <div id="draggable-section">
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default SaveButtonDraggable;
