angular.module('drillApp')
.directive('draggable', ['$document', function($document) {
  return {
    link: function(scope, element, attr) {
      let startX = 0;
      let startY = 0;
      let startPos;

      element.css({
       cursor: 'pointer',
      });

      element.on('mousedown', mousedown);

      function mousedown(event) {
        if (!$(event.target).hasClass('drag-handle')) return;
        startPos = element.position();
        startX = event.pageX;
        startY = event.pageY;
        // Prevent default dragging of selected content
        event.preventDefault();
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      }

      function mousemove(event) {
        x = startPos.left + (event.pageX - startX);
        y = startPos.top + (event.pageY - startY);
        element.css({
          top: y + 'px',
          left: x + 'px',
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    },
  };
}]);
