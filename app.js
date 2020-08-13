const navSlide = () => {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav-links');
  const navLinks = document.querySelectorAll('.nav-links li');
 
  burger.addEventListener('click', () => {
       // Toggle Nav
      nav.classList.toggle('nav-active');

      // Animate Links
      navLinks.forEach((link, index) => {
          if (link.style.animation) {
              link.style.animation = '';
          } else {
              link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
          }
      });
      // Burger Animation
      burger.classList.toggle('toggle');

  });
  
}

navSlide();








$(window).on("scroll", function () {
  if ($(window).scrollTop()) {
    $("header").addClass("nav-bar-scroll");
  } else {
    $("header").removeClass("nav-bar-scroll");
  }
});


var Dial = function(container) {
  this.container = container;
  this.size = this.container.dataset.size / 2;
  this.strokeWidth = this.size / 8;
  this.radius = (this.size / 2) - (this.strokeWidth / 2);
  this.value = this.container.dataset.value;
  this.direction = this.container.dataset.arrow;
  this.svg;
  this.defs;
  this.slice;
  this.overlay;
  this.text;
  this.arrow;
  this.create();
}

Dial.prototype.create = function() {
  this.createSvg();
  this.createDefs();
  this.createSlice();
  this.createOverlay();
  this.createText();
  this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', this.size + 'px');
  svg.setAttribute('height', this.size + 'px');
  this.svg = svg;
};

Dial.prototype.createDefs = function() {
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute('id', 'gradient');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', '#6E4AE2');
  stop1.setAttribute('offset', '0%');
  linearGradient.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', '#78F8EC');
  stop2.setAttribute('offset', '100%');
  linearGradient.appendChild(stop2);
  var linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradientBackground.setAttribute('id', 'gradient-background');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', 'rgba(0, 0, 0, 0.2)');
  stop1.setAttribute('offset', '0%');
  linearGradientBackground.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', 'rgba(0, 0, 0, 0.05)');
  stop2.setAttribute('offset', '100%');
  linearGradientBackground.appendChild(stop2);
  defs.appendChild(linearGradient);
  defs.appendChild(linearGradientBackground);
  this.svg.appendChild(defs);
  this.defs = defs;
};

Dial.prototype.createSlice = function() {
  var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  slice.setAttribute('fill', 'none');
  slice.setAttribute('stroke', 'url(#gradient)');
  slice.setAttribute('stroke-width', this.strokeWidth);
  slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
  slice.setAttribute('class', 'animate-draw');
  this.svg.appendChild(slice);
  this.slice = slice;
};

Dial.prototype.createOverlay = function() {
  var r = this.size - (this.size / 2) - this.strokeWidth / 2;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute('cx', this.size / 2);
  circle.setAttribute('cy', this.size / 2);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', 'url(#gradient-background)');
  this.svg.appendChild(circle);
  this.overlay = circle;
};

Dial.prototype.createText = function() {
  var fontSize = this.size / 3.5;
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', (this.size / 2) + fontSize / 7.5);
  text.setAttribute('y', (this.size / 2) + fontSize / 4);
  text.setAttribute('font-family', 'Century Gothic, Lato');
  text.setAttribute('font-size', fontSize);
  text.setAttribute('fill', '#78F8EC');
  text.setAttribute('text-anchor', 'middle');
  var tspanSize = fontSize / 3;
  text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
  this.svg.appendChild(text);
  this.text = text;
};


Dial.prototype.animateStart = function() {
  var v = 0;
  var self = this;
  var intervalOne = setInterval(function() {
      var p = +(v / self.value).toFixed(2);
      var a = (p < 0.95) ? 2 - (2 * p) : 0.05;
      v += a;
      if(v >= +self.value) {
          v = self.value;
          clearInterval(intervalOne);
      }
      self.setValue(v);
  }, 10);
};

Dial.prototype.animateReset = function() {
  this.setValue(0);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
return {
  x: centerX + (radius * Math.cos(angleInRadians)),
  y: centerY + (radius * Math.sin(angleInRadians))
};
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
  var start = this.polarToCartesian(x, y, radius, endAngle);
  var end = this.polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

Dial.prototype.setValue = function(value) {	
  var c = (value / 100) * 360;
  if(c === 360)
    c = 359.99;
  var xy = this.size / 2 - this.strokeWidth / 2;
  var d = this.describeArc(xy, xy, xy, 180, 180 + c);
  this.slice.setAttribute('d', d);
  var tspanSize = (this.size / 3.5) / 3;
  this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};

var containers = document.getElementsByClassName("chart");
var dial = new Dial(containers[0]);
dial.animateStart();

// card2

var Dial = function(container) {
  this.container = container;
  this.size = this.container.dataset.size / 2;
  this.strokeWidth = this.size / 8;
  this.radius = (this.size / 2) - (this.strokeWidth / 2);
  this.value = this.container.dataset.value;
  this.direction = this.container.dataset.arrow;
  this.svg;
  this.defs;
  this.slice;
  this.overlay;
  this.text;
  this.arrow;
  this.create();
}

Dial.prototype.create = function() {
  this.createSvg();
  this.createDefs();
  this.createSlice();
  this.createOverlay();
  this.createText();
  this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', this.size + 'px');
  svg.setAttribute('height', this.size + 'px');
  this.svg = svg;
};

Dial.prototype.createDefs = function() {
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute('id', 'gradient');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', '#6E4AE2');
  stop1.setAttribute('offset', '0%');
  linearGradient.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', '#78F8EC');
  stop2.setAttribute('offset', '100%');
  linearGradient.appendChild(stop2);
  var linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradientBackground.setAttribute('id', 'gradient-background');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', 'rgba(0, 0, 0, 0.2)');
  stop1.setAttribute('offset', '0%');
  linearGradientBackground.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', 'rgba(0, 0, 0, 0.05)');
  stop2.setAttribute('offset', '100%');
  linearGradientBackground.appendChild(stop2);
  defs.appendChild(linearGradient);
  defs.appendChild(linearGradientBackground);
  this.svg.appendChild(defs);
  this.defs = defs;
};

Dial.prototype.createSlice = function() {
  var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  slice.setAttribute('fill', 'none');
  slice.setAttribute('stroke', 'url(#gradient)');
  slice.setAttribute('stroke-width', this.strokeWidth);
  slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
  slice.setAttribute('class', 'animate-draw');
  this.svg.appendChild(slice);
  this.slice = slice;
};

Dial.prototype.createOverlay = function() {
  var r = this.size - (this.size / 2) - this.strokeWidth / 2;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute('cx', this.size / 2);
  circle.setAttribute('cy', this.size / 2);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', 'url(#gradient-background)');
  this.svg.appendChild(circle);
  this.overlay = circle;
};

Dial.prototype.createText = function() {
  var fontSize = this.size / 3.5;
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', (this.size / 2) + fontSize / 7.5);
  text.setAttribute('y', (this.size / 2) + fontSize / 4);
  text.setAttribute('font-family', 'Century Gothic, Lato');
  text.setAttribute('font-size', fontSize);
  text.setAttribute('fill', '#78F8EC');
  text.setAttribute('text-anchor', 'middle');
  var tspanSize = fontSize / 3;
  text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
  this.svg.appendChild(text);
  this.text = text;
};


Dial.prototype.animateStart = function() {
  var v = 0;
  var self = this;
  var intervalOne = setInterval(function() {
      var p = +(v / self.value).toFixed(2);
      var a = (p < 0.95) ? 2 - (2 * p) : 0.05;
      v += a;
      if(v >= +self.value) {
          v = self.value;
          clearInterval(intervalOne);
      }
      self.setValue(v);
  }, 10);
};

Dial.prototype.animateReset = function() {
  this.setValue(0);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
return {
  x: centerX + (radius * Math.cos(angleInRadians)),
  y: centerY + (radius * Math.sin(angleInRadians))
};
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
  var start = this.polarToCartesian(x, y, radius, endAngle);
  var end = this.polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

Dial.prototype.setValue = function(value) {	
  var c = (value / 100) * 360;
  if(c === 360)
    c = 359.99;
  var xy = this.size / 2 - this.strokeWidth / 2;
  var d = this.describeArc(xy, xy, xy, 180, 180 + c);
  this.slice.setAttribute('d', d);
  var tspanSize = (this.size / 3.5) / 3;
  this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};

var containers = document.getElementsByClassName("chart");
var dial2 = new Dial(containers[1]);
dial2.animateStart();

// card3
var Dial = function(container) {
  this.container = container;
  this.size = this.container.dataset.size / 2;
  this.strokeWidth = this.size / 8;
  this.radius = (this.size / 2) - (this.strokeWidth / 2);
  this.value = this.container.dataset.value;
  this.direction = this.container.dataset.arrow;
  this.svg;
  this.defs;
  this.slice;
  this.overlay;
  this.text;
  this.arrow;
  this.create();
}

Dial.prototype.create = function() {
  this.createSvg();
  this.createDefs();
  this.createSlice();
  this.createOverlay();
  this.createText();
  this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', this.size + 'px');
  svg.setAttribute('height', this.size + 'px');
  this.svg = svg;
};

Dial.prototype.createDefs = function() {
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute('id', 'gradient');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', '#6E4AE2');
  stop1.setAttribute('offset', '0%');
  linearGradient.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', '#78F8EC');
  stop2.setAttribute('offset', '100%');
  linearGradient.appendChild(stop2);
  var linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradientBackground.setAttribute('id', 'gradient-background');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', 'rgba(0, 0, 0, 0.2)');
  stop1.setAttribute('offset', '0%');
  linearGradientBackground.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', 'rgba(0, 0, 0, 0.05)');
  stop2.setAttribute('offset', '100%');
  linearGradientBackground.appendChild(stop2);
  defs.appendChild(linearGradient);
  defs.appendChild(linearGradientBackground);
  this.svg.appendChild(defs);
  this.defs = defs;
};

Dial.prototype.createSlice = function() {
  var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  slice.setAttribute('fill', 'none');
  slice.setAttribute('stroke', 'url(#gradient)');
  slice.setAttribute('stroke-width', this.strokeWidth);
  slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
  slice.setAttribute('class', 'animate-draw');
  this.svg.appendChild(slice);
  this.slice = slice;
};

Dial.prototype.createOverlay = function() {
  var r = this.size - (this.size / 2) - this.strokeWidth / 2;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute('cx', this.size / 2);
  circle.setAttribute('cy', this.size / 2);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', 'url(#gradient-background)');
  this.svg.appendChild(circle);
  this.overlay = circle;
};

Dial.prototype.createText = function() {
  var fontSize = this.size / 3.5;
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', (this.size / 2) + fontSize / 7.5);
  text.setAttribute('y', (this.size / 2) + fontSize / 4);
  text.setAttribute('font-family', 'Century Gothic, Lato');
  text.setAttribute('font-size', fontSize);
  text.setAttribute('fill', '#78F8EC');
  text.setAttribute('text-anchor', 'middle');
  var tspanSize = fontSize / 3;
  text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
  this.svg.appendChild(text);
  this.text = text;
};


Dial.prototype.animateStart = function() {
  var v = 0;
  var self = this;
  var intervalOne = setInterval(function() {
      var p = +(v / self.value).toFixed(2);
      var a = (p < 0.95) ? 2 - (2 * p) : 0.05;
      v += a;
      if(v >= +self.value) {
          v = self.value;
          clearInterval(intervalOne);
      }
      self.setValue(v);
  }, 10);
};

Dial.prototype.animateReset = function() {
  this.setValue(0);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
return {
  x: centerX + (radius * Math.cos(angleInRadians)),
  y: centerY + (radius * Math.sin(angleInRadians))
};
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
  var start = this.polarToCartesian(x, y, radius, endAngle);
  var end = this.polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

Dial.prototype.setValue = function(value) {	
  var c = (value / 100) * 360;
  if(c === 360)
    c = 359.99;
  var xy = this.size / 2 - this.strokeWidth / 2;
  var d = this.describeArc(xy, xy, xy, 180, 180 + c);
  this.slice.setAttribute('d', d);
  var tspanSize = (this.size / 3.5) / 3;
  this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};

var containers = document.getElementsByClassName("chart");
var dial3 = new Dial(containers[2]);
dial3.animateStart();

// card 4
var Dial = function(container) {
  this.container = container;
  this.size = this.container.dataset.size / 2;
  this.strokeWidth = this.size / 8;
  this.radius = (this.size / 2) - (this.strokeWidth / 2);
  this.value = this.container.dataset.value;
  this.direction = this.container.dataset.arrow;
  this.svg;
  this.defs;
  this.slice;
  this.overlay;
  this.text;
  this.arrow;
  this.create();
}

Dial.prototype.create = function() {
  this.createSvg();
  this.createDefs();
  this.createSlice();
  this.createOverlay();
  this.createText();
  this.container.appendChild(this.svg);
};

Dial.prototype.createSvg = function() {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('width', this.size + 'px');
  svg.setAttribute('height', this.size + 'px');
  this.svg = svg;
};

Dial.prototype.createDefs = function() {
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradient.setAttribute('id', 'gradient');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', '#6E4AE2');
  stop1.setAttribute('offset', '0%');
  linearGradient.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', '#78F8EC');
  stop2.setAttribute('offset', '100%');
  linearGradient.appendChild(stop2);
  var linearGradientBackground = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
  linearGradientBackground.setAttribute('id', 'gradient-background');
  var stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop1.setAttribute('stop-color', 'rgba(0, 0, 0, 0.2)');
  stop1.setAttribute('offset', '0%');
  linearGradientBackground.appendChild(stop1);
  var stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
  stop2.setAttribute('stop-color', 'rgba(0, 0, 0, 0.05)');
  stop2.setAttribute('offset', '100%');
  linearGradientBackground.appendChild(stop2);
  defs.appendChild(linearGradient);
  defs.appendChild(linearGradientBackground);
  this.svg.appendChild(defs);
  this.defs = defs;
};

Dial.prototype.createSlice = function() {
  var slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
  slice.setAttribute('fill', 'none');
  slice.setAttribute('stroke', 'url(#gradient)');
  slice.setAttribute('stroke-width', this.strokeWidth);
  slice.setAttribute('transform', 'translate(' + this.strokeWidth / 2 + ',' + this.strokeWidth / 2 + ')');
  slice.setAttribute('class', 'animate-draw');
  this.svg.appendChild(slice);
  this.slice = slice;
};

Dial.prototype.createOverlay = function() {
  var r = this.size - (this.size / 2) - this.strokeWidth / 2;
  var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute('cx', this.size / 2);
  circle.setAttribute('cy', this.size / 2);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', 'url(#gradient-background)');
  this.svg.appendChild(circle);
  this.overlay = circle;
};

Dial.prototype.createText = function() {
  var fontSize = this.size / 3.5;
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('x', (this.size / 2) + fontSize / 7.5);
  text.setAttribute('y', (this.size / 2) + fontSize / 4);
  text.setAttribute('font-family', 'Century Gothic, Lato');
  text.setAttribute('font-size', fontSize);
  text.setAttribute('fill', '#78F8EC');
  text.setAttribute('text-anchor', 'middle');
  var tspanSize = fontSize / 3;
  text.innerHTML = 0 + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
  this.svg.appendChild(text);
  this.text = text;
};


Dial.prototype.animateStart = function() {
  var v = 0;
  var self = this;
  var intervalOne = setInterval(function() {
      var p = +(v / self.value).toFixed(2);
      var a = (p < 0.95) ? 2 - (2 * p) : 0.05;
      v += a;
      if(v >= +self.value) {
          v = self.value;
          clearInterval(intervalOne);
      }
      self.setValue(v);
  }, 10);
};

Dial.prototype.animateReset = function() {
  this.setValue(0);
};

Dial.prototype.polarToCartesian = function(centerX, centerY, radius, angleInDegrees) {
var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
return {
  x: centerX + (radius * Math.cos(angleInRadians)),
  y: centerY + (radius * Math.sin(angleInRadians))
};
}

Dial.prototype.describeArc = function(x, y, radius, startAngle, endAngle){
  var start = this.polarToCartesian(x, y, radius, endAngle);
  var end = this.polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
  return d;       
}

Dial.prototype.setValue = function(value) {	
  var c = (value / 100) * 360;
  if(c === 360)
    c = 359.99;
  var xy = this.size / 2 - this.strokeWidth / 2;
  var d = this.describeArc(xy, xy, xy, 180, 180 + c);
  this.slice.setAttribute('d', d);
  var tspanSize = (this.size / 3.5) / 3;
  this.text.innerHTML = Math.floor(value) + '<tspan font-size="' + tspanSize + '" dy="' + -tspanSize * 1.2 + '">%</tspan>';
};

var containers = document.getElementsByClassName("chart");
var dial4 = new Dial(containers[3]);
dial4.animateStart();