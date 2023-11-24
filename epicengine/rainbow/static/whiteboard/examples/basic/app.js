/* PubNub */

var channel = 'draw';

var pubnub = PUBNUB.init({
		publish_key: 'pub-c-b710a41c-449b-44f3-9821-a7f907a91a59',
		subscribe_key: 'sub-c-9034986c-ccc5-11e8-80d1-72aadab1d7f1',
		ssl: true,
});

pubnub.subscribe({
  channel: channel,
  callback: drawFromStream,
  presence: function(m){
    if(m.occupancy > 0){
      document.getElementById('occupancy').textContent = m.occupancy;
    }
  }
});

/* Draw on canvas */

var canvas = document.getElementById('drawCanvas');
var ctx = canvas.getContext('2d');

var parent = document.getElementById("boardid");
canvas.width = parent.offsetWidth;
canvas.height = parent.offsetHeight;
	 
ctx.lineWidth = '3';
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

var color = '#f44336';

canvas.addEventListener('mousedown', startDraw, false);
canvas.addEventListener('mousemove', draw, false);
canvas.addEventListener('mouseup', endDraw, false);

function drawOnCanvas(color, plots, lineWidth) {
  ctx.strokeStyle = color;
  temp = ctx.lineWidth;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(plots[0].x, plots[0].y);

  for(var i=1; i<plots.length; i++) {
    ctx.lineTo(plots[i].x, plots[i].y);
  }
  ctx.stroke();
  ctx.lineWidth = temp;
}

function drawFromStream(message) {
  if(!message || message.plots.length < 1) return;			
  drawOnCanvas(message.color, message.plots, message.lineWidth);
}

var isActive = false;
var plots = [];

function draw(e) {
  if(!isActive) return;

  var x = e.offsetX || e.layerX - canvas.offsetLeft;
  var y = e.offsetY || e.layerY - canvas.offsetTop;

  plots.push({x: x, y: y});
  drawOnCanvas(color, plots, ctx.lineWidth);
}
	
function startDraw(e) {
  isActive = true;
}

function changeColor(newColor) {
  color = newColor
}

function endDraw(e) {
  isActive = false;
  
  pubnub.publish({
    channel: channel,
    message: {
      color: color, 
      plots: plots,
      lineWidth: ctx.lineWidth
    }
  });

  plots = [];
}

function resizer() {
  canvas.width = parent.offsetWidth;
  canvas.height = parent.offsetHeight;
}

function changer(x) {
  console.log(document.getElementById("color-btn"));
  console.log(x);
  if(x==="erase") {
    console.log("INSIDE");
    ctx.lineWidth = 50;
    changeColor("#fffff1");
  }
  else {
    document.getElementById("color-btn").style.backgroundColor = x;
    ctx.lineWidth = 3;
    changeColor(x);
  }
}

function save() {
  var link = document.getElementById('link');
  link.setAttribute('download', 'MintyPaper.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
}
