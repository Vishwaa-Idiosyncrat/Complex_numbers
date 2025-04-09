/***********************************************************************************/
/* createVector.js */

function createVector(data){
  if(navigator.vibrate){ navigator.vibrate([50]); }

  for(var i in data){ this[i] = data[i]; }

  this.vector_color = color(data.vectorID);
  this.gray_color = "gray";
  this.manipulationMode = false;
  this.manipulationActive = false;
  this.moving = false;
  // Example of an array-based approach:
  const complexSymbols = ["z", "w", "u", "v", "p", "q", "r", "s"];
  this.symbol = complexSymbols[data.vectorID] || "z";
  this.visibility = true;
  this.addition_possible = false;
  this.addition_data = {};
  this.addedVectors = data.addedVectors;
  screen_svg.vector_log[data.vectorID] = this;
  if(this.delete_allowed == undefined){ this.delete_allowed = true; }
  if(this.addition_resolution_allowed == undefined){ this.addition_resolution_allowed = true; }
  if(this.addition_change_mode_allowed == undefined){ this.addition_change_mode_allowed = true; }

  this.control_circle_radius = 3 * screen_dpi;
  this.control_line_size = 4 * screen_dpi;
  this.addition_circle_radius = 2 * screen_size;

  if(this.taskScreen == true && this.parent.parent_svg){
    this.parent.parent_svg.append("marker").attrs({ id: "arrow_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });
      
    this.parent.parent_svg.append("marker").attrs({ id: "arrow_component_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 3, markerHeight: 3, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });
      
    this.parent.parent_svg.append("marker").attrs({ id: "arrow_gray_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.gray_color, "fill": this.gray_color });
  } else {
    this.parent.canvas.append("marker").attrs({ id: "arrow_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });
      
    this.parent.canvas.append("marker").attrs({ id: "arrow_component_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 3, markerHeight: 3, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.vector_color, "fill": this.vector_color });
      
    this.parent.canvas.append("marker").attrs({ id: "arrow_gray_" + this.vectorID, viewBox: "0 0 10 10", refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" })
      .append("circle").attrs({ id: "arrow-path", cx: 5, cy: 5, r: 4 }).styles({ "stroke": this.gray_color, "fill": this.gray_color });
  }

  this.create();
  this.setup();
  this.update();
  this.setup_view();
  if(this.addedVectors != true){ this.createEvents(); }
}

/***********************************************************************************/

createVector.prototype.create = function(){
  this.container = this.parent.canvas.append("g").classed("vector_g", true);
  this.circle = this.container.append("circle").data([this]);
  this.xAxis = this.container.append("line");
  this.yAxis = this.container.append("line");

  /*************************** Projection lines and paths ***************************/
  this.xComponent_triangle = this.container.append("path").attr("class", "projection_" + this.vectorID);
  this.yComponent_triangle = this.container.append("path").attr("class", "projection_" + this.vectorID);

  this.xProjection_line = this.container.append("line").attr("class", "projection_" + this.vectorID);
  this.yProjection_line = this.container.append("line").attr("class", "projection_" + this.vectorID);

  this.xProjection_circle = this.container.append("circle").attr("class", "projection_" + this.vectorID);
  this.yProjection_circle = this.container.append("circle").attr("class", "projection_" + this.vectorID);

  this.vector_head_circle = this.container.append("circle").attr("class", "projection_" + this.vectorID);
  this.vector_line_dotted = this.container.append("line").attr("class", "projection_" + this.vectorID);

  /*************************** Vectors ***************************/
  this.vector_line_inactive = this.container.append("line");
  this.vector_line = this.container.append("line");

  this.xComponent_line = this.container.append("line");
  this.yComponent_line = this.container.append("line");

  this.centre_circle = this.container.append("circle");

  /*************************** Controls ***************************/
  this.vector_resolve_rect_g = this.container.append("g");
  this.vector_resolve_rect = this.vector_resolve_rect_g.append("rect").data([this]);

  this.angle_control_line = this.container.append("line").data([this]);
  this.radius_control_circle = this.container.append("circle").data([this]);
  this.centre_control_circle = this.container.append("circle").data([this]);
  this.xComponent_control_circle = this.container.append("circle").data([this]);
  this.yComponent_control_circle = this.container.append("circle").data([this]);
  this.vector_recombine_circle = this.container.append("circle").data([this]);

  /*************************** Addition circle ***************************/
  // this.addition_centre_circle = this.container.append("circle").data([this]);
  this.addition_circle = this.container.append("circle").data([this]);

  /*************************** Extra Controls ***************************/
  this.delete_button = { size: 5 * screen_size, size_big: 8 * screen_size };
  this.delete_button.posX = -8 * screen_size;
  this.delete_button.posY = -8 * screen_size;
  this.delete_button.shown = false;
  this.delete_button.active = false;
  this.delete_button.image = this.container.append("image")
    .attrs({ "xlink:href": "../../Images/delete.png", width: 0, height: 0 }).data([this]);

  this.create_text();
  this.create_equation();
}

/***********************************************************************************/

createVector.prototype.setup = function(){
  this.circle.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1 * screen_size, "stroke-dasharray": "3,3", "fill": this.vector_color, "fill-opacity": 0 });
  this.xAxis.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1 * screen_size, "stroke-dasharray": "3,3" });
  this.yAxis.styles({ "stroke": this.gray_color, "stroke-opacity": 0.5, "stroke-width": 0.1 * screen_size, "stroke-dasharray": "3,3" });

  /*************************** Projection lines and paths ***************************/
  this.xComponent_triangle.styles({ "fill": this.vector_color, "fill-opacity": 0.3, "stroke": "none" });
  this.yComponent_triangle.styles({ "fill": this.vector_color, "fill-opacity": 0.2, "stroke": "none" });

  this.xProjection_line.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.15 * screen_size, "stroke-dasharray": "3,3" });
  this.yProjection_line.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.15 * screen_size, "stroke-dasharray": "3,3" });

  this.xProjection_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });
  this.yProjection_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });

  this.vector_head_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 0.8 });
  this.vector_line_dotted.styles({ "stroke": this.vector_color, "stroke-opacity": 0.6, "stroke-width": 0.2 * screen_size, "stroke-dasharray": "3,3" });

  /*************************** Vectors ***************************/
  this.vector_line_inactive.styles({ "stroke": this.gray_color, "stroke-width": 0.4 * screen_size })
    .attrs({ "marker-end": "url(#arrow_gray_" + this.vectorID + ")" });
  this.vector_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4 * screen_size })
    .attrs({ "marker-end": "url(#arrow_" + this.vectorID + ")" });

  this.xComponent_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4 * screen_size })
    .attrs({ "marker-end": "url(#arrow_component_" + this.vectorID + ")" });
  this.yComponent_line.styles({ "stroke": this.vector_color, "stroke-width": 0.4 * screen_size })
    .attrs({ "marker-end": "url(#arrow_component_" + this.vectorID + ")" });

  this.centre_circle.styles({ "stroke": "none", "fill": this.vector_color, "fill-opacity": 1 });

  /*************************** Controls ***************************/
  this.vector_resolve_rect.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");

  this.angle_control_line.styles({ "stroke": this.vector_color, "stroke-width": this.control_line_size }).attr("class", "invisible");
  this.radius_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.xComponent_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.yComponent_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.centre_control_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");
  this.vector_recombine_circle.styles({ "stroke": "none", "fill": this.vector_color }).attr("class", "invisible");

  /*************************** Addition circle ***************************/
  this.addition_circle.styles({ "stroke": "none", "fill": this.gray_color, "fill-opacity": 0.3 });
  // this.addition_centre_circle.styles({ "stroke": "none", "fill": this.gray_color }).attr("class", "invisible");

  this.setup_text();
  this.setup_equation();
}

/***********************************************************************************/

createVector.prototype.update = function(){
  if( isNaN(this.r) || isNaN(this.angle_rad) || isNaN(this.cx) || isNaN(this.cy) ){ return; }

  /*************************** Component dimensions ***************************/
  this.angle_deg = this.angle_rad * 180 / Math.PI;
  if(this.angle_deg < 0){ this.angle_deg += 360; }

  this.xComponent_length = this.r * Math.cos(this.angle_rad);
  this.yComponent_length = this.r * Math.sin(this.angle_rad);

  this.xComponent_coordinate = this.cx + this.r * Math.cos(this.angle_rad);
  this.yComponent_coordinate = this.cy - this.r * Math.sin(this.angle_rad);

  /*************************** Container ***************************/
  this.container.attrs({ "transform": "translate(" + this.cx + "," + this.cy + ")" });
  this.circle.attrs({ cx: 0, cy: 0, r: this.r });
  this.xAxis.attrs({ x1: -this.r, y1: 0, x2: this.r, y2: 0 });
  this.yAxis.attrs({ y1: -this.r, x1: 0, y2: this.r, x2: 0 });

  /*************************** Projection lines and paths ***************************/
  this.xComponent_triangle.attrs({ d: line_gen([ [0,0], [this.xComponent_length, 0], [this.xComponent_length, -this.yComponent_length] ]) });
  this.yComponent_triangle.attrs({ d: line_gen([ [0,0], [0, -this.yComponent_length], [this.xComponent_length, -this.yComponent_length] ]) });

  this.xProjection_line.attrs({ x1: this.xComponent_length, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.yProjection_line.attrs({ x1: 0, y1: -this.yComponent_length, x2: this.xComponent_length, y2: -this.yComponent_length });

  this.xProjection_circle.attrs({ cx: this.xComponent_length, cy: 0, r: 0.4 * screen_size });
  this.yProjection_circle.attrs({ cx: 0, cy: -this.yComponent_length, r: 0.4 * screen_size });

  this.vector_head_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: 0.4 * screen_size });
  this.vector_line_dotted.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });

  /*************************** Vectors ***************************/
  this.vector_line_inactive.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.vector_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });

  if(this.addedVectors != true){
    this.xComponent_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: 0 });
    this.yComponent_line.attrs({ x1: 0, y1: 0, x2: 0, y2: -this.yComponent_length });
  }

  this.centre_circle.attrs({ cx: 0, cy: 0, r: 0.8 * screen_size });

  /*************************** Addition circle ***************************/
  this.addition_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.addition_circle_radius });
  // this.addition_centre_circle.attrs({ cx: 0, cy: 0, r: this.control_circle_radius });

  /*************************** Controls ***************************/
  this.vector_resolve_rect_g.attrs({ "transform": "rotate(" + (-this.angle_deg) + ")" });
  this.vector_resolve_rect.attrs({ x: 0, y: -10 * screen_dpi, width: this.r, height: 20 * screen_dpi });

  this.angle_control_line.attrs({ x1: 0, y1: 0, x2: this.xComponent_length, y2: -this.yComponent_length });
  this.radius_control_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.control_circle_radius });
  this.xComponent_control_circle.attrs({ cx: this.xComponent_length, cy: 0, r: this.control_circle_radius });
  this.yComponent_control_circle.attrs({ cx: 0, cy: -this.yComponent_length, r: this.control_circle_radius });

  this.centre_control_circle.attrs({ cx: 0, cy: 0, r: this.control_circle_radius });
  this.vector_recombine_circle.attrs({ cx: this.xComponent_length, cy: -this.yComponent_length, r: this.control_circle_radius });

  /*************************** Vectors are added ***************************/
  // if(this.vectorsAdded == true){
  //   if(this.addition_data.position == "first"){
  //     this.addition_data.patner.cx = this.cx + this.xComponent_length;
  //     this.addition_data.patner.cy = this.cy - this.yComponent_length;
  //     this.addition_data.patner.update();
  //     this.updateAddedVectors();
  //   }
  //   else{ this.addition_data.patner.updateAddedVectors(); }
  // }

  this.update_text();
  this.update_equation();
}

/***********************************************************************************/

createVector.prototype.setup_view = function(){
  this.vector_line_inactive.styles({ "display": "none" });
  this.vector_recombine_circle.styles({ "display": "none" });
  this.addition_circle.styles({ "display": "none" });
  // this.addition_centre_circle.styles({ "display": "none" });

  /*************************** Hide all controls ***************************/
  this.vector_resolve_rect.styles({ "display": "none" });
  this.angle_control_line.styles({ "display": "none" });
  this.radius_control_circle.styles({ "display": "none" });
  this.xComponent_control_circle.styles({ "display": "none" });
  this.yComponent_control_circle.styles({ "display": "none" });

  /*************************** Manipulation not possible ***************************/
  if(this.manipulationPossible == false){
    this.vector_line_inactive.styles({ "display": null });
    this.vector_line.styles({ "display": "none" });
    this.circle.styles({ "display": "none" });
    this.xAxis.styles({ "display": "none" });
    this.yAxis.styles({ "display": "none" });
    this.centre_circle.styles({ "fill": this.gray_color });
    this.vector_resolve_rect.styles({ "display": "none" });
    this.angle_control_line.styles({ "display": "none" });
    this.radius_control_circle.styles({ "display": "none" });
    this.xComponent_control_circle.styles({ "display": "none" });
    this.yComponent_control_circle.styles({ "display": "none" });
    this.centre_control_circle.styles({ "display": "none" });
    this.xComponent_line.styles({ "display": "none" });
    this.yComponent_line.styles({ "display": "none" });
    d3.selectAll(".projection_" + this.vectorID).styles({ "display": "none" });

    this.text_2.text.styles({ "display": "none" });
    this.text_2.textBox.styles({ "display": "none" });
    this.text_3.text.styles({ "display": "none" });
    this.text_3.textBox.styles({ "display": "none" });
    return;
  }

  /*************************** Controls ***************************/
  if(this.manipulables.r == false){ this.radius_control_circle.attrs({ "display": "none" }); }
  if(this.manipulables.angle == false){ this.angle_control_line.attrs({ "display": "none" }); }
  if(this.manipulables.xComponent == false){ this.xComponent_control_circle.attrs({ "display": "none" }); }
  if(this.manipulables.yComponent == false){ this.yComponent_control_circle.attrs({ "display": "none" }); }

  if(this.resolution_allowed == false){ this.vector_resolve_rect.attrs({ "display": "none" }); }

  /*************************** vector mode ***************************/
  if(this.vector_mode == "polar"){
    this.xComponent_line.styles({ "display": "none" });
    this.yComponent_line.styles({ "display": "none" });
    d3.selectAll(".projection_" + this.vectorID).styles({ "display": "none" });
  }

  if(this.vector_mode == "cartesian"){
    this.vector_line.styles({ "display": "none" });
    this.xProjection_circle.styles({ "display": "none" });
    this.yProjection_circle.styles({ "display": "none" });
  }

  this.setup_view_text();
  this.setup_view_equation();
}

/***********************************************************************************/
/* Updated Text Functions */

/* Create the text elements. Notice that text_3 is used for the complex number in the format "a ± bi".
   Below, text_2 has been updated to display:
   "zr = <radius> | zθ = <angle>" */
createVector.prototype.create_text = function(){
  this.font_size_normal = 1.85 * screen_size;
  this.font_size_small = 1.7 * screen_size;

  // Text element for complex number display "a ± bi"
  this.text_3 = {};
  this.text_3.data = {
    posX: 0,
    posY: -this.r - 1.5 * this.font_size_normal,
    textBox: { 
      "fill": this.vector_color, 
      "fill-opacity": 0.1, 
      width: 8 * this.font_size_normal, 
      height: 1.8 * this.font_size_normal 
    },
    tspans: [
      {
        index: 0,
        value: this.symbol + " = ", // e.g., "z = "
        "dominant-baseline": "middle",
        "font-size": this.font_size_normal,
        fill: this.vector_color,
        "font-family": "sans-serif"
      },
      {
        index: 1,
        value: 0,  // will hold the real part
        "dominant-baseline": "middle",
        "font-size": this.font_size_normal,
        fill: "black",
        "font-family": "sans-serif"
      },
      {
        index: 2,
        value: "", // will hold the operator " + " or " - "
        "dominant-baseline": "middle",
        "font-size": this.font_size_normal,
        fill: "black",
        "font-family": "sans-serif"
      },
      {
        index: 3,
        value: 0,  // will hold the imaginary part with appended "i"
        "dominant-baseline": "middle",
        "font-size": this.font_size_normal,
        fill: "black",
        "font-family": "sans-serif"
      }
    ]
  };

  this.text_3.group = this.container.append("g");
  this.text_3.textBox = this.text_3.group.append("rect");
  this.text_3.text = this.text_3.group.append("text");
  this.text_3.tspans = [];
  for (let i in this.text_3.data.tspans) {
    this.text_3.tspans[i] = this.text_3.text.append("tspan");
  }

  // Updated text_2 for displaying radius and angle in the desired format:
  // "zr = <radius> | zθ = <angle>"
  this.text_2 = {};
  this.text_2.data = {
    posX: 0,
    posY: -this.r - 1.5 * this.font_size_normal,
    textBox: { 
      "fill": this.vector_color, 
      "fill-opacity": 0.1, 
      width: 8 * this.font_size_normal, 
      height: 1.8 * this.font_size_normal 
    },
    tspans: [
      { index: 0, value: this.symbol + "r", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 1, value: " = ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 2, value: Math.round(radius_scale(this.r) * 10) / 10, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 3, value: " | ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 4, value: this.symbol + "θ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 5, value: " = ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 6, value: Math.round(this.angle_deg * 10) / 10 + "\u00B0", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" }
    ]
  };

  this.text_2.group = this.container.append("g");
  this.text_2.textBox = this.text_2.group.append("rect");
  this.text_2.text = this.text_2.group.append("text");
  this.text_2.tspans = [];
  for (let i in this.text_2.data.tspans) {
    this.text_2.tspans[i] = this.text_2.text.append("tspan");
  }

  this.text_1 = {};
  this.text_1.data = {
    textBox: { "fill": this.vector_color, "fill-opacity": 0.5, width: 1.2 * this.font_size_normal, height: 1.8 * this.font_size_normal },
    posY: -this.r - 1.5 * this.font_size_normal,
    tspans: [
      { index: 0, value: this.symbol, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" }
    ]
  };
  this.text_1.data.posX = -0.5 * this.text_2.data.textBox.width - 0.5 * this.text_1.data.textBox.width;

  this.text_1.group = this.container.append("g");
  this.text_1.textBox = this.text_1.group.append("rect");
  this.text_1.text = this.text_1.group.append("text");
  this.text_1.tspans = [];
  for (let i in this.text_1.data.tspans) {
    this.text_1.tspans[i] = this.text_1.text.append("tspan");
  }
}

/***********************************************************************************/
/* Setup text styles */
createVector.prototype.setup_text = function(){
  // Setup text box for text_3
  let box = this.text_3.textBox;
  let box_data = this.text_3.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Setup tspans for text_3
  for (let i in this.text_3.tspans) {
    let tspan = this.text_3.tspans[i];
    let tspan_data = this.text_3.data.tspans[i];
    tspan.styles({ 
      "font-size": tspan_data["font-size"], 
      "dominant-baseline": tspan_data["dominant-baseline"], 
      "fill": tspan_data["fill"], 
      "font-family": tspan_data["font-family"] 
    });
  }

  // Setup text box for text_2
  box = this.text_2.textBox;
  box_data = this.text_2.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Setup tspans for text_2
  for (let i in this.text_2.tspans) {
    let tspan = this.text_2.tspans[i];
    let tspan_data = this.text_2.data.tspans[i];
    tspan.styles({ 
      "font-size": tspan_data["font-size"], 
      "dominant-baseline": tspan_data["dominant-baseline"], 
      "fill": tspan_data["fill"], 
      "font-family": tspan_data["font-family"] 
    });
  }

  // Setup text box for text_1
  box = this.text_1.textBox;
  box_data = this.text_1.data.textBox;
  box.styles({ "fill": box_data["fill"], "fill-opacity": box_data["fill-opacity"] });

  // Setup tspans for text_1
  for (let i in this.text_1.tspans) {
    let tspan = this.text_1.tspans[i];
    let tspan_data = this.text_1.data.tspans[i];
    tspan.styles({ 
      "font-size": tspan_data["font-size"], 
      "dominant-baseline": tspan_data["dominant-baseline"], 
      "fill": tspan_data["fill"], 
      "font-family": tspan_data["font-family"] 
    });
  }
}

/***********************************************************************************/
/* Dynamically update text */
createVector.prototype.update_text = function(){
  // Update text_2 (radius and angle display)
  // Note: The tspans for text_2 have fixed labels so the numerical values here may be updated later if needed.
  this.text_2.data.tspans[2].value = this.parent.settings.show_decimals 
    ? Math.round(radius_scale(this.r) * 10) / 10 
    : Math.round(radius_scale(this.r));
  this.text_2.data.tspans[6].value = (this.parent.settings.show_decimals 
    ? Math.round(this.angle_deg * 10) / 10 
    : Math.round(this.angle_deg)) + "\u00B0";

  // Calculate real and imaginary parts for the complex number display
  let zx = radius_scale(this.r) * Math.cos(this.angle_rad);
  let zy = radius_scale(this.r) * Math.sin(this.angle_rad);
  if (this.parent.settings.show_decimals) {
    zx = Math.round(zx * 10) / 10;
    zy = Math.round(zy * 10) / 10;
  } else {
    zx = Math.round(zx);
    zy = Math.round(zy);
  }

  // Set the real part in text_3
  this.text_3.data.tspans[1].value = zx;

  // Determine the proper operator and set the imaginary part with a trailing "i"
  if (zy < 0) {
    this.text_3.data.tspans[2].value = " - ";
    this.text_3.data.tspans[3].value = Math.abs(zy) + "i";
  } else {
    this.text_3.data.tspans[2].value = " + ";
    this.text_3.data.tspans[3].value = zy + "i";
  }

  // Adjust vertical positions based on vector mode
  if(this.vector_mode == "polar"){
    this.text_1.data.posY = -this.r - 1.5 * this.font_size_normal;
    this.text_2.data.posY = -this.r - 1.5 * this.font_size_normal;
    this.text_3.data.posY = -this.r - 1.5 * this.font_size_normal;
  }
  if(this.vector_mode == "cartesian"){
    this.text_1.data.posY = -this.r - 2.45 * this.font_size_normal;
    this.text_2.data.posY = -this.r - 3.4 * this.font_size_normal;
    this.text_3.data.posY = -this.r - 1.5 * this.font_size_normal;
  }

  if(this.addedVectors === true && this.object !== undefined){
    var resultant = this.object.resultant;
    if(this.position == "first"){
      this.text_1.data.posY = -resultant.r - 3.4 * this.font_size_normal;
      this.text_2.data.posY = -resultant.r - 3.4 * this.font_size_normal;
      this.text_3.data.posY = -resultant.r - 3.4 * this.font_size_normal;
      this.text_1.data.posX = -this.text_2.data.textBox.width - 0.5 * this.text_1.data.textBox.width;
      this.text_2.data.posX = -0.5 * this.text_2.data.textBox.width;
      this.text_3.data.posX = -0.5 * this.text_2.data.textBox.width;
    }
    if(this.position == "second"){
      if(this.object.addition_mode == "triangle"){
        this.text_1.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5 * this.font_size_normal;
        this.text_2.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5 * this.font_size_normal;
        this.text_3.data.posY = this.object.vector_1.yComponent_length - resultant.r - 1.5 * this.font_size_normal;
        this.text_1.data.posX = -this.object.vector_1.xComponent_length - this.text_2.data.textBox.width - 0.5 * this.text_1.data.textBox.width;
        this.text_2.data.posX = -this.object.vector_1.xComponent_length - 0.5 * this.text_2.data.textBox.width;
        this.text_3.data.posX = -this.object.vector_1.xComponent_length - 0.5 * this.text_2.data.textBox.width;
      }
      if(this.object.addition_mode == "parallelogram"){
        this.text_1.data.posY = 0 - resultant.r - 1.5 * this.font_size_normal;
        this.text_2.data.posY = 0 - resultant.r - 1.5 * this.font_size_normal;
        this.text_3.data.posY = 0 - resultant.r - 1.5 * this.font_size_normal;
        this.text_1.data.posX = -this.text_2.data.textBox.width - 0.5 * this.text_1.data.textBox.width;
        this.text_2.data.posX = -0.5 * this.text_2.data.textBox.width;
        this.text_3.data.posX = -0.5 * this.text_2.data.textBox.width;
      }
    }
    if(this.position == "resultant"){
      this.text_1.data.posY = -resultant.r - 2.45 * this.font_size_normal;
      this.text_2.data.posY = -resultant.r - 2.45 * this.font_size_normal;
      this.text_3.data.posY = -resultant.r - 2.45 * this.font_size_normal;
      this.text_1.data.posX = 0.5 * this.text_1.data.textBox.width;
      this.text_2.data.posX = 0.5 * this.text_2.data.textBox.width + this.text_1.data.textBox.width;
      this.text_3.data.posX = 0.5 * this.text_2.data.textBox.width + this.text_1.data.textBox.width;
    }
  }

  // Update text_3's text box
  let box_data = this.text_3.data.textBox;
  let data = this.text_3.data;
  this.text_3.textBox.attrs({ 
    x: data.posX - 0.5 * box_data.width, 
    y: data.posY - 0.5 * box_data.height, 
    width: box_data.width, 
    height: box_data.height 
  });

  // Update text_3's text and tspans
  this.text_3.text.attrs({ x: this.text_3.data.posX, y: this.text_3.data.posY });
  for (let i in this.text_3.tspans) {
    let tspan = this.text_3.tspans[i];
    let tspan_data = this.text_3.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }

  // Update text_2's text box and tspans
  box_data = this.text_2.data.textBox;
  data = this.text_2.data;
  this.text_2.textBox.attrs({ 
    x: data.posX - 0.5 * box_data.width, 
    y: data.posY - 0.5 * box_data.height, 
    width: box_data.width, 
    height: box_data.height 
  });
  this.text_2.text.attrs({ x: this.text_2.data.posX, y: this.text_2.data.posY });
  for (let i in this.text_2.tspans) {
    let tspan = this.text_2.tspans[i];
    let tspan_data = this.text_2.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }

  if(this.manipulationPossible == false){
    this.text_1.data.posX = 0;
  }

  // Update text_1's text box and tspans
  box_data = this.text_1.data.textBox;
  data = this.text_1.data;
  this.text_1.textBox.attrs({ 
    x: data.posX - 0.5 * box_data.width, 
    y: data.posY - 0.5 * box_data.height, 
    width: box_data.width, 
    height: box_data.height, 
    rx: 0.3 * box_data.width, 
    ry: 0.3 * box_data.width 
  });
  this.text_1.text.attrs({ x: this.text_1.data.posX, y: this.text_1.data.posY });
  for (let i in this.text_1.tspans) {
    let tspan = this.text_1.tspans[i];
    let tspan_data = this.text_1.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }
}

/***********************************************************************************/
/* Setup view text: show or hide text_3 based on vector mode */
createVector.prototype.setup_view_text = function(){
  if(this.vector_mode == "polar"){
    this.text_3.text.styles({ "display": "none" });
    this.text_3.textBox.styles({ "display": "none" });
  }
  if(this.vector_mode == "cartesian"){
    this.text_3.text.styles({ "display": null });
    this.text_3.textBox.styles({ "display": null });
  }
}

/***********************************************************************************/
/* Setup conjugate */
createVector.prototype.conjugate = function() {
  // Reflect the vector across the x-axis by flipping its angle
  this.angle_rad = -this.angle_rad;
  // Re-draw the vector
  this.update();
};

createVector.prototype.dashed_representation = function(original_x, original_y){
  this.vector_line_dotted = this.container.append("line").attr("class", "projection_" + this.vectorID);

  this.vector_line_dotted.styles({
    "stroke": this.vector_color,
    "stroke-opacity": 0.6,
    "stroke-width": 0.2 * screen_size,
    "stroke-dasharray": "3,3"
  });

  this.vector_line_dotted.attrs({
    x1: 0,
    y1: 0,
    x2: original_x,
    y2: -original_y
  });
}


createVector.prototype.flip_vector = function() {
  // Store the current (pre-flip) values
  const original_x = this.xComponent_length;
  const original_y = this.yComponent_length;

  // Flip the vector
  this.angle_rad += Math.PI;
  this.angle_rad %= (2 * Math.PI);

  // Update the flipped vector visually
  this.update();

  // Now draw the dashed representation using the original components
  this.dashed_representation(original_x, original_y);
}
