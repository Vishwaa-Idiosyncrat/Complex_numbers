/***********************************************************************************/
/* createActions.js */

createVector.prototype.toggleManipulationMode = function() {

  /*************************** Manipulation on ***************************/
  if (this.manipulationMode === true) {
    this.circle.styles({ "fill-opacity": 0.075 });
    if (this.vector_mode === "polar") {
      this.radius_control_circle.styles({ "display": null });
      this.angle_control_line.styles({ "display": null });
      this.vector_resolve_rect.styles({ "display": null });
    }
    if (this.vector_mode === "cartesian") {
      if (this.cartesian_mode_controls === "polar") {
        this.radius_control_circle.styles({ "display": null });
        this.angle_control_line.styles({ "display": null });
      }
      if (this.cartesian_mode_controls === "cartesian") {
        this.xComponent_control_circle.styles({ "display": null });
        this.yComponent_control_circle.styles({ "display": null });
      }
    }
  }

  /*************************** Manipulation off ***************************/
  if (this.manipulationMode === false) {
    this.circle.styles({ "fill-opacity": 0 });
    this.radius_control_circle.styles({ "display": "none" });
    this.angle_control_line.styles({ "display": "none" });
    this.vector_resolve_rect.styles({ "display": "none" });
    this.xComponent_control_circle.styles({ "display": "none" });
    this.yComponent_control_circle.styles({ "display": "none" });
  }
};

/***********************************************************************************/
createVector.prototype.resolve_vector = function() {
  this.vector_mode = "cartesian";
  if (navigator.vibrate) { navigator.vibrate([50]); }

  const temp_len = parseInt(this.centre_circle.attr("r"));
  this.centre_circle
    .transition().delay(0).duration(200)
    .attrs({ r: 2 * temp_len })
    .transition().delay(50).duration(150)
    .attrs({ r: temp_len });

  this.xComponent_line
    .styles({ "display": null, "opacity": 0 })
    .transition().delay(0).duration(1500)
    .styles({ "opacity": 1 });

  this.yComponent_line
    .styles({ "display": null, "opacity": 0 })
    .attrs({ x1: this.xComponent_length, x2: this.xComponent_length })
    .transition().delay(0).duration(1500)
    .styles({ "opacity": 1 })
    .transition().delay(0).duration(1500)
    .attrs({ x1: 0, x2: 0 });

  this.vector_line
    .transition().delay(1000).duration(1000)
    .styles({ "opacity": 0 })
    .transition().delay(0).duration(0)
    .styles({ "opacity": 1, "display": "none" });

  this.xProjection_circle
    .transition().delay(3000).duration(0)
    .styles({ "display": "none" });
  this.yProjection_circle
    .transition().delay(3000).duration(0)
    .styles({ "display": "none" });
  this.vector_resolve_rect.styles({ "display": "none" });
  if (this.cartesian_mode_controls === "cartesian") {
    this.radius_control_circle.styles({ "display": "none" });
    this.angle_control_line.styles({ "display": "none" });
    this.xComponent_control_circle.styles({ "display": null });
    this.yComponent_control_circle.styles({ "display": null });
  }
  const temp_object = this;
  setTimeout(function() {
    temp_object.text_3.text.styles({ "display": null });
    temp_object.text_3.textBox.styles({ "display": null });
    temp_object.update();
  }, 3000);
};

/***********************************************************************************/
createVector.prototype.recombine_vector = function() {
  this.vector_mode = "polar";
  if (navigator.vibrate) { navigator.vibrate([50]); }

  this.yComponent_line
    .transition().delay(500).duration(1500)
    .attrs({ x1: this.xComponent_length, x2: this.xComponent_length })
    .transition().delay(500).duration(500)
    .styles({ "opacity": 0 })
    .transition().delay(0).duration(0)
    .styles({ "opacity": 1, "display": "none" });

  this.xComponent_line
    .transition().delay(2500).duration(500)
    .styles({ "opacity": 0 })
    .transition().delay(0).duration(0)
    .styles({ "opacity": 1, "display": "none" });

  this.vector_line
    .transition().delay(2000).duration(0)
    .styles({ "opacity": 0, "display": null })
    .transition().delay(0).duration(500)
    .styles({ "opacity": 1 });

  d3.selectAll(".projection_" + this.vectorID)
    .transition().delay(3000).duration(500)
    .styles({ "opacity": 0 })
    .transition().delay(0).duration(0)
    .styles({ "opacity": 1, "display": "none" });

  this.radius_control_circle.styles({ "display": null });
  this.angle_control_line.styles({ "display": null });
  this.xComponent_control_circle.styles({ "display": "none" });
  this.yComponent_control_circle.styles({ "display": "none" });
  this.vector_resolve_rect.styles({ "display": null });

  const temp_object = this;
  setTimeout(function() {
    temp_object.text_3.text.styles({ "display": "none" });
    temp_object.text_3.textBox.styles({ "display": "none" });
    temp_object.update();
  }, 3500);
};

/***********************************************************************************/
createVector.prototype.checkForAddition = function() {
  const index = this.vectorID;
  for (let i in this.parent.vector_list) {
    if (i == index) continue;
    if (this.vector_mode === "polar" && this.parent.vector_list[i].vector_mode === "polar") {
      if (this.parent.vector_list[i].addition_possible) {
        if (this.parent.vector_list[i].addition_data.patner_ID !== this.vectorID) {
          continue;
        }
      }
      if (this.addition_allowed === false || this.parent.vector_list[i].addition_allowed === false) {
        continue;
      }
      // 1) HEAD of current vector near TAIL of the other
      const temp_dist_1 = distpoints(
        this.cx + this.xComponent_length,
        this.cy - this.yComponent_length,
        this.parent.vector_list[i].cx,
        this.parent.vector_list[i].cy
      );
      if (temp_dist_1 < this.addition_circle_radius) {
        this.cx = this.parent.vector_list[i].cx - this.xComponent_length;
        this.cy = this.parent.vector_list[i].cy + this.yComponent_length;
        this.addition_circle.styles({ "display": null });
        this.addition_data = {
          position: "first",
          patner: this.parent.vector_list[i],
          patner_ID: this.parent.vector_list[i].vectorID
        };
        this.addition_possible = true;
        this.parent.vector_list[i].addition_data = {
          position: "second",
          patner: this,
          patner_ID: this.vectorID
        };
        this.parent.vector_list[i].addition_possible = true;
        return;
      }
      // 2) TAIL of current vector near HEAD of the other
      const temp_dist_2 = distpoints(
        this.cx,
        this.cy,
        this.parent.vector_list[i].xComponent_coordinate,
        this.parent.vector_list[i].yComponent_coordinate
      );
      if (temp_dist_2 < this.addition_circle_radius) {
        this.cx = this.parent.vector_list[i].xComponent_coordinate;
        this.cy = this.parent.vector_list[i].yComponent_coordinate;
        this.addition_data = {
          position: "second",
          patner: this.parent.vector_list[i],
          patner_ID: this.parent.vector_list[i].vectorID
        };
        this.addition_possible = true;
        this.parent.vector_list[i].addition_circle.styles({ "display": null });
        this.parent.vector_list[i].addition_data = {
          position: "first",
          patner: this,
          patner_ID: this.vectorID
        };
        this.parent.vector_list[i].addition_possible = true;
        return;
      }
    }
  }
  if (this.addition_possible) {
    this.addition_data.patner.addition_possible = false;
    this.addition_data.patner.addition_circle.styles({ "display": "none" });
    this.addition_data.patner.addition_data = {};
    if (this.addition_data.patner.addition_centre_circle) {
      this.addition_data.patner.addition_centre_circle.remove();
    }
    this.addition_possible = false;
    this.addition_circle.styles({ "display": "none" });
    this.addition_data = {};
    if (this.addition_centre_circle) {
      this.addition_centre_circle.remove();
    }
  }
};

/***********************************************************************************/
// NEW: checkForMultiplication()
// Multiplication gesture: when the TAILS (centers) of two vectors are close,
// mark them as potential multiplication partners.
createVector.prototype.checkForMultiplication = function() {
  const index = this.vectorID;
  for (let i in this.parent.vector_list) {
    if (i == index) continue;
    const other = this.parent.vector_list[i];
    if (this.vector_mode !== "polar" || other.vector_mode !== "polar") continue;
    if (!this.multiplication_allowed || !other.multiplication_allowed) continue;
    const tailDist = distpoints(this.cx, this.cy, other.cx, other.cy);
    if (tailDist < this.addition_circle_radius) { // reuse threshold
      this.multiplication_data = {
        patner: other,
        patner_ID: other.vectorID
      };
      this.multiplication_possible = true;
      other.multiplication_data = {
        patner: this,
        patner_ID: this.vectorID
      };
      other.multiplication_possible = true;
      return;
    }
  }
  if (this.multiplication_possible) {
    if (this.multiplication_data.patner) {
      const partner = this.multiplication_data.patner;
      partner.multiplication_possible = false;
      partner.multiplication_data = {};
    }
    this.multiplication_possible = false;
    this.multiplication_data = {};
  }
};
/***********************************************************************************/
