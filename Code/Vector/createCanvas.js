/***********************************************************************************/

function createCanvas(element) {

  var element_width = parseInt(element.style("width"));
  var element_height = parseInt(element.style("height"));

  var outer_div = element.append("div").styles({ "width": element_width, "height": element_height });
  screen_svg = {};
  screen_svg.canvas = outer_div.append("svg").styles({ "width": "100%", "height": "100%" });
  screen_svg.vector_log = [];
  screen_svg.vector_list = [];
  screen_svg.selected_vectors = []
  screen_svg.vectorID = -1;
  screen_svg.settings = { show_decimals: false };

  screen_svg.canvas.on("touchstart", function () {
    d3.event.preventDefault();
  })

  screen_svg.canvas.on("touchmove", function () {
    d3.event.preventDefault();
  })

  createCanvasEvents();

  /*************************** Heading ***************************/

  screen_svg.canvas.append("text")
    .styles({ "font-size": 2 * screen_size, "fill": "black", "font-family": "serif" })
    .attrs({ x: 0.5 * innerWidth, y: 4 * screen_size })
    .text("Touchy Feely Complex Numbers");

  /*************************** Refresh Icon ***************************/

  refresh_icon_size = 3 * screen_dpi;
  temp_pos = { x: 0.92 * innerWidth, y: 5 * screen_size };

  screen_svg.canvas.append("image")
    .attrs({ x: temp_pos.x - 0.5 * refresh_icon_size, y: temp_pos.y - 0.5 * refresh_icon_size, width: refresh_icon_size, height: refresh_icon_size, "xlink:href": "../../Images/settings.svg" });

  refresh_icon_circle = screen_svg.canvas.append("circle")
    .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 0.2 * screen_size })
    .attrs({ cx: temp_pos.x, cy: temp_pos.y, r: 0.8 * refresh_icon_size });

  refresh_icon_circle.on("touchstart", function () {
    d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
  })

  refresh_icon_circle.on("touchend", function () {
    d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
  })

  refresh_icon_circle.on("click", function () {
    swal({
      title: 'Settings',
      html: '<input id="settings_show_decimals" type="checkbox" ' + (screen_svg.settings.show_decimals ? "checked = ''" : "") + ' /> Show Decimals',
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Done',
    }).then((result) => {
      screen_svg.settings.show_decimals = document.getElementById('settings_show_decimals').checked
      screen_svg.vector_log.forEach(function (vector) {
        if(vector) vector.update();
      })
    })
  })

  temp_pos = { x: 0.92 * innerWidth, y: 12 * screen_size };
  screen_svg.canvas.append("image")
    .attrs({ x: temp_pos.x - 0.5 * refresh_icon_size, y: temp_pos.y - 0.5 * refresh_icon_size, width: refresh_icon_size, height: refresh_icon_size, "xlink:href": "../../Images/refresh.svg" });

  refresh_icon_circle = screen_svg.canvas.append("circle")
    .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 0.2 * screen_size })
    .attrs({ cx: temp_pos.x, cy: temp_pos.y, r: 0.8 * refresh_icon_size });

  refresh_icon_circle.on("touchstart", function () {
    d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
  })

  refresh_icon_circle.on("touchend", function () {
    d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
  })

  refresh_icon_circle.on("click", function () {
    d3.selectAll(".vector_g").remove();
    screen_svg.vector_list = [];
    screen_svg.addition_log = [];
    screen_svg.vectorID = -1;
  })

  /*************************** help icon ***************************/

  screen_svg.canvas
    .append("text")
    .styles({ "font-family": "FontAwesome", "font-size": 2 * 3 * screen_dpi, "dominant-baseline": "central", "text-anchor": "middle", "fill": "#707070", 'cursor': 'pointer' })
    .attrs({ "x": temp_pos.x, y: temp_pos.y + 7 * screen_dpi })
    .html("\uf29c")
    .on("click", function () {
      // window.open("https://youtu.be/yOyv4GLOKB0", "_default");
      window.open("https://youtu.be/RR1WX6o5hfM", "_default");
    })



// In createCanvas.js initialization
screen_svg.selection = {
  selectedVectors: [], // Tracks vectors in selection order
  getSelected: function() {
    return this.selectedVectors.slice(); // Return a copy
  },
  clearAll: function() {
    this.selectedVectors.forEach(v => v.isSelected = false);
    this.selectedVectors = [];
  },
  select: function(vector) {
    this.clearAll();
    vector.isSelected = true;
    this.selectedVectors.push(vector);
  },
  toggle: function(vector) {
    const index = this.selectedVectors.indexOf(vector);
    
    if (index === -1) {
      // Add to selectedVectors if not already present
      this.selectedVectors.push(vector);
      vector.isSelected = true;
    } else {
      // Remove from selectedVectors if deselected
      this.selectedVectors.splice(index, 1);
      vector.isSelected = false;
    }
  }
};

  /*************************** NEW: S–x axis Button (Conjugate) ***************************/
  let conj_icon_size = 3 * screen_dpi;
  // Position it below the help icon, for example
  temp_pos = { x: 0.92 * innerWidth, y: 25 * screen_size };

  // If you have a custom icon, reference it here. For now, let's assume "conjugate.svg"
  screen_svg.canvas.append("image")
    .attrs({
      x: temp_pos.x - 0.5 * conj_icon_size,
      y: temp_pos.y - 0.5 * conj_icon_size,
      width: conj_icon_size,
      height: conj_icon_size,
      "xlink:href": "../../Images/conjugate.png"
    });

  let conj_icon_circle = screen_svg.canvas.append("circle")
    .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 0.2 * screen_size })
    .attrs({ cx: temp_pos.x, cy: temp_pos.y, r: 0.8 * conj_icon_size });

  conj_icon_circle.on("touchstart", function() {
    d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
  });

  conj_icon_circle.on("touchend", function() {
    d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
  });

  // On click, call `conjugate()` for each vector
conj_icon_circle.on("click", function() {

  const selected = screen_svg.selection.getSelected();
    
    if (selected.length === 0) {
      d3.select(this).transition()
        .style("stroke", "red")
        .transition()
        .style("stroke", "gray");
      return;
    }
    
    // Last selected is the most recent
    const lastSelected = selected[selected.length - 1];
    lastSelected.conjugate();
});  


  /*************************** Flip Button ***********************/ 

  temp_pos = { x: 0.92 * innerWidth, y: 3 * screen_size };
  screen_svg.canvas.append("image")
    .attrs({ x: temp_pos.x - 0.5 * refresh_icon_size, y: temp_pos.y + 10 * refresh_icon_size, width: refresh_icon_size, height: refresh_icon_size, "xlink:href": "../../Images/equation.png" });

  flip_icon = screen_svg.canvas.append("circle")
    .styles({ "fill": "gray", "fill-opacity": 0, "stroke": "gray", "stroke-width": 0.2 * screen_size })
    .attrs({ cx: temp_pos.x , cy: temp_pos.y + 10.5 * refresh_icon_size, r: 0.8 * refresh_icon_size });

  flip_icon.on("touchstart", function () {
    d3.select(this).styles({ "fill-opacity": 0.2, "stroke": "#555" });
  })

  flip_icon.on("touchend", function () {
    d3.select(this).styles({ "fill-opacity": 0, "stroke": "gray" });
  })

  flip_icon.classed("flip-button", true);

  flip_icon.on("click", function() {
    const selected = screen_svg.selection.getSelected();
    
    if (selected.length === 0) {
      d3.select(this).transition()
        .style("stroke", "red")
        .transition()
        .style("stroke", "gray");
      return;
    }
    
    // Last selected is the most recent
    const lastSelected = selected[selected.length - 1];
    lastSelected.flip_vector();
  });

  
  /*************************** Footer ***************************/

  var temp_text = screen_svg.canvas.append("text")
    .attrs({ x: 0.5 * innerWidth, y: 0.97 * innerHeight })
    .styles({ "font-size": 2 * screen_dpi });

  temp_text.append("tspan")
    .styles({ "color": "gray" })
    .text("- designed by")

  temp_text.append("tspan")
    .styles({ "fill": "steelblue", "font-size": 2 * screen_dpi, "cursor": "hand", "font-weight": "normal", "font-family": "sans-serif" })
    .text(" Learning Sciences Research Group")
    .on("click", function () {
      window.open("http://lsr.hbcse.tifr.res.in/", "_default");
    })
}

/***********************************************************************************/

function createCanvasEvents() {

  screen_svg.canvas.on("touchstart", function () {
    if (d3.event.touches.length == 2) {
      touch_1 = d3.event.touches[0];
      touch_2 = d3.event.touches[1];
      if (touch_1.target.nodeName == "svg" && touch_2.target.nodeName == "svg") {

        screen_svg.vectorID++;
        var temp_vector = new createVector({
          parent: screen_svg,
          cx: touch_1.pageX,
          cy: touch_1.pageY,
          r: distpoints(touch_1.pageX, touch_1.pageY, touch_2.pageX, touch_2.pageY),
          manipulationPossible: true,
          angle_rad: Math.atan2(-(touch_2.pageY - touch_1.pageY), (touch_2.pageX - touch_1.pageX)),
          manipulables: { r: true, angle: true, xComponent: true, yComponent: true },
          resolution_allowed: true,
          movementAllowed: true,
          vector_mode: "polar",               // "cartesian", "polar"
          cartesian_mode_controls: "polar",   // "cartesian", "polar"
          vectorID: screen_svg.vectorID,
          addition_allowed: true,
          addedVectors: false,
          delete_allowed: true,
          taskScreen: false,
          addition_resolution_allowed: true,
          addition_change_mode_allowed: true
        })

        // document.getElementById('beep').volume = 0;
        // document.getElementById('beep').play();
        // // if(navigator.vibrate){ navigator.vibrate([50]); };
        screen_svg.vector_list.push(temp_vector);

      }
    }
  })

}

/***********************************************************************************/
