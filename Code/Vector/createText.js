/***********************************************************************************/
// Create text

createVector.prototype.create_text = function(){
  this.font_size_normal = 1.85 * screen_size;
  this.font_size_small = 1.7 * screen_size;

  // Text element for complex number in the format "a ± bi"
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
        value: "", // will hold the operator (" + " or " - ")
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

  // Updated text_2 for displaying radius and angle.
  // Desired output: z₍r₎ = <radius> | z₍θ₎ = <angle>
  // We break the display into multiple tspans so that the parts "r" and "θ" can be subscripted.
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
      { index: 0, value: this.symbol, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 1, value: "r", "baseline-shift": "sub", "font-size": this.font_size_small, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 2, value: " = ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 3, value: Math.round(radius_scale(this.r) * 10) / 10, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 4, value: " | ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 5, value: this.symbol, "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 6, value: "θ", "baseline-shift": "sub", "font-size": this.font_size_small, "fill": this.vector_color, "font-family": "sans-serif" },
      { index: 7, value: " = ", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" },
      { index: 8, value: Math.round(this.angle_deg * 10) / 10 + "\u00B0", "dominant-baseline": "middle", "font-size": this.font_size_normal, "fill": "black", "font-family": "sans-serif" }
    ]
  };

  this.text_2.group = this.container.append("g");
  this.text_2.textBox = this.text_2.group.append("rect");
  this.text_2.text = this.text_2.group.append("text");
  this.text_2.tspans = [];
  for (let i in this.text_2.data.tspans) {
    this.text_2.tspans[i] = this.text_2.text.append("tspan");
    // If a baseline-shift property exists, set it as an attribute.
    if(this.text_2.data.tspans[i]["baseline-shift"]) {
      this.text_2.tspans[i].attr("baseline-shift", this.text_2.data.tspans[i]["baseline-shift"]);
    }
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
};

/***********************************************************************************/
// Setup text

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
    if(tspan_data["baseline-shift"]) {
      tspan.attr("baseline-shift", tspan_data["baseline-shift"]);
    }
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
};

/***********************************************************************************/
// Update text

createVector.prototype.update_text = function(){
  // Update text_2 values (e.g., radius and angle)
  this.text_2.data.tspans[3].value = this.parent.settings.show_decimals 
    ? Math.round(radius_scale(this.r) * 10) / 10 
    : Math.round(radius_scale(this.r));
  this.text_2.data.tspans[8].value = (this.parent.settings.show_decimals 
    ? Math.round(this.angle_deg * 10) / 10 
    : Math.round(this.angle_deg)) + "\u00B0";
  
  // Calculate real and imaginary components for text_3
  let zx = radius_scale(this.r) * Math.cos(this.angle_rad);
  let zy = radius_scale(this.r) * Math.sin(this.angle_rad);
  if (this.parent.settings.show_decimals) {
    zx = Math.round(zx * 10) / 10;
    zy = Math.round(zy * 10) / 10;
  } else {
    zx = Math.round(zx);
    zy = Math.round(zy);
  }
  
  // Set the real part for text_3
  this.text_3.data.tspans[1].value = zx;
  
  // Determine the operator and set the imaginary part with an "i"
  if (zy < 0) {
    this.text_3.data.tspans[2].value = " - ";
    this.text_3.data.tspans[3].value = Math.abs(zy) + "i";
  } else {
    this.text_3.data.tspans[2].value = " + ";
    this.text_3.data.tspans[3].value = zy + "i";
  }
  
  // Adjust positions based on the vector mode
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
  
  let box_data = this.text_3.data.textBox;
  let data = this.text_3.data;
  this.text_3.textBox.attrs({ 
    x: data.posX - 0.5 * box_data.width, 
    y: data.posY - 0.5 * box_data.height, 
    width: box_data.width, 
    height: box_data.height 
  });
  
  this.text_3.text.attrs({ x: this.text_3.data.posX, y: this.text_3.data.posY });
  for (let i in this.text_3.tspans) {
    let tspan = this.text_3.tspans[i];
    let tspan_data = this.text_3.data.tspans[i];
    tspan.text(tspan_data["value"]);
  }
  
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
};

/***********************************************************************************/
// Setup view text

createVector.prototype.setup_view_text = function(){
  if(this.vector_mode == "polar"){
    this.text_3.text.styles({ "display": "none" });
    this.text_3.textBox.styles({ "display": "none" });
  }
  if(this.vector_mode == "cartesian"){
    this.text_3.text.styles({ "display": null });
    this.text_3.textBox.styles({ "display": null });
  }
};
