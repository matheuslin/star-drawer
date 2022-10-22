var nVertices;
var screenWidth;
var screenHeight;
var oVertices;
var canvasCtx;
var animationIteration;

function init(){

    // configure number of vertices 
    // and how many vertices positions should be "incremented"
    // to define the ends of a line
    nVertices = 101;
    let increment = 35;

    // offset fot the first vertex. - Math.PI / 2 = "top, center"
    let angleOffset = - Math.PI / 2;
  
    // get and apply other display settings
    let canvas = document.getElementById("screen");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    // limit to 500 px square
    canvas.width = Math.min(screenWidth - 10, 500);
    canvas.height = Math.min(screenHeight - 10, 500);

    // resize canvas to adapt to the screen size
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    // get the "center" position of the canvas
    let cx = canvasWidth / 2;
    let cy = canvasHeight / 2;

    // radius: minimum, so it won't "overflow" outside the canvas area
    let r = Math.min(cx, cy) - 10;

    // define vertice positions
    let vertices = createVertices(cx, cy, r, nVertices, angleOffset);

    // define the order the vertices should be used to draw the lines
    oVertices = getVerticesOrder(vertices, increment);
    
    canvasCtx = canvas.getContext('2d');
    animationIteration = 0;
}

function createVertices(cx, cy, r, n, angleOffset){
    let vertices = [];
    let deltaAngle = 2 * Math.PI / n;
    for(let i = 0; i < n; i++){
        let angle = i * deltaAngle + angleOffset;
        let x = cx + r * Math.cos(angle);
        let y = cy + r * Math.sin(angle);
        let vertex = {
            x: x,
            y:y
        };
        vertices.push(vertex);
    }
    return vertices;
}

function getVerticesOrder(vertices, increment){
    let orderedVertices = [];
    for(let i = 0; i < vertices.length; i++){
        orderedVertices.push(vertices[i * increment % vertices.length]);
    }

    return orderedVertices;
}

function draw(ctx, vertices){
    ctx.moveTo(vertices[0].x, vertices[0].y);
    for(let i = 0 ; i < vertices.length; i++){
        let v = vertices[(i + 1) % vertices.length];
        ctx.lineTo(v.x, v.y);
    }
    ctx.stroke();
}

function animateOneLine(){
    drawOneLine(canvasCtx, oVertices, animationIteration);
    animationIteration++;
    if(animationIteration < nVertices){
        requestAnimationFrame(animateOneLine);
    }
    else{
        console.log("Finished!");
    }
}

function drawOneLine(ctx, vertices, iteration){
    let v1 = vertices[iteration % vertices.length];
    let v2 = vertices[(iteration + 1) % vertices.length];

    ctx.moveTo(v1.x, v1.y);
    ctx.lineTo(v2.x, v2.y);
    ctx.stroke();
}

init();
requestAnimationFrame(animateOneLine);