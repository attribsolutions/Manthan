import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui/ui/widgets/draggable";
import './styles.css';

const SaveButtonDraggable = ({ children }) => {
  useEffect(() => {
    // Check if jQuery is available
    if (typeof $ !== 'undefined') {
      $(document).ready(() => {
        const ball = $("#draggable-section");

        const containmentBounds = {
          left: 250,
          top: 75,
          rightOffset: 20, // Offset from the right of the page
          bottomOffset: 50, // Maximum distance from the bottom
        };

        const calculateRightConstraint = () => {
          const windowWidth = $(window).width();
          return windowWidth - containmentBounds.rightOffset;
        };

        const calculateBottomConstraint = () => {
          const windowHeight = $(window).height();
          const scrollTop = $(window).scrollTop();
          const maxBottom = scrollTop + windowHeight - containmentBounds.bottomOffset;

          return Math.min(maxBottom, windowHeight + scrollTop);
        };

        ball.draggable({
          containment: [
            containmentBounds.left,
            containmentBounds.top,
            calculateRightConstraint(),
            calculateBottomConstraint(),
          ],
        });

        // Update containment when the window is resized or scrolled
        $(window).on('resize scroll', () => {
          ball.draggable('option', 'containment', [
            containmentBounds.left,
            containmentBounds.top,
            calculateRightConstraint(),
            calculateBottomConstraint(),
          ]);
        });
      });
    } else {
      console.error("jQuery is not available. Make sure it is properly loaded.");
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
