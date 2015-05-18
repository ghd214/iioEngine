
//DEFINITION
iio.Grid = function(){ this.Grid.apply(this, arguments) };
iio.inherit(iio.Grid, iio.Rectangle);
iio.Grid.prototype._super = iio.Rectangle.prototype;

//CONSTRUCTOR
iio.Grid.prototype.Grid = function() {
  this._super.Rectangle.call(this,this.merge_props(arguments));

  // set res if undefined
  this.res = this.res || new iio.Vector(
    this.width/this.C,
    this.height/this.R
  );

  // set width/height if undefined
  this.width = this.width || this.C * this.res.x;
  this.height = this.height || this.R * this.res.y;

  // initialize cells
  this.init_cells();
}

//FUNCTIONS
iio.Grid.prototype.init_cells = function(){
  this.cells = [];
  var x = -this.res.x * (this.C - 1) / 2;
  var y = -this.res.y * (this.R - 1) / 2;
  for (var c = 0; c < this.C; c++) {
    this.cells[c] = [];
    for (var r = 0; r < this.R; r++) {
      this.cells[c][r] = this.add({
        pos:{
          x:x,
          y:y
        },
        c: c,
        r: r,
        width: this.res.x,
        height: this.res.y
      });
      y += this.res.y;
    }
    y = -this.res.y * (this.R - 1) / 2;
    x += this.res.x;
  }
}
iio.Grid.prototype.clear = function(noDraw){
  this.objs = [];
  this.init_cells();
  if(noDraw);
  else this.app.draw();
}
iio.Grid.prototype.cellCenter = function(c, r) {
  return {
    x: -this.width / 2 + c * this.res.x + this.res.x / 2,
    y: -this.height / 2 + r * this.res.y + this.res.y / 2
  }
}
iio.Grid.prototype.cellAt = function(x, y) {
  if (x.x) return this.cells[Math.floor((x.x - this.left) / this.res.x)][Math.floor((x.y - this.top) / this.res.y)];
  else return this.cells[Math.floor((x - this.left) / this.res.x)][Math.floor((y - this.top) / this.res.y)];
}
iio.Grid.prototype.foreachCell = function(fn, p) {
  for (var c = 0; c < this.C; c++)
    for (var r = 0; r < this.R; r++)
      if (fn(this.cells[c][r], p) === false)
        return [r, c];
}

//DRAW FUNCTIONS
iio.Grid.prototype.draw_shape = function(ctx) {
  ctx.translate(-this.width / 2, -this.height / 2);
  /*iio.draw.rect(ctx, this.width, this.height, {
    c: this.color,
    o: this.outline
  }, {
    img: this.img,
    anims: this.anims,
    mov: this.mov,
    round: this.round
  });*/
  if (this.color) {
    if (this.color.indexOf && this.color.indexOf('gradient') > -1)
      this.color = this.createGradient(ctx, this.color);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    for (var c = 1; c < this.C; c++) iio.draw.line(ctx, c * this.res.x, 0, c * this.res.x, this.height);
    for (var r = 1; r < this.R; r++) iio.draw.line(ctx, 0, r * this.res.y, this.width, r * this.res.y);
  }
}