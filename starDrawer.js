function animation_OneLine(ctx, orderedVertices){
    this.ctx = ctx;
    this.vertices = orderedVertices;
    this.i = 0;

    this.v1 = null;
    this.v2 = null;

    this.animate = function(){
        this.v1 = this.vertices[this.i % this.vertices.length];
        this.v2 = this.vertices[(this.i + 1) % this.vertices.length];
        this.i++;
        return this.i < this.vertices.length;
    };

    this.draw = function(){
        this.ctx.beginPath();

        this.ctx.moveTo(this.v1.x, this.v1.y);
        this.ctx.lineTo(this.v2.x, this.v2.y);
        this.ctx.stroke();
    }
}

function animation_OneLineFading(ctx, orderedVertices){
    this.ctx = ctx;
    this.vertices = orderedVertices;
    this.i = 0;

    this.v1 = null;
    this.v2 = null;

    this.animate = function(){
        this.v1 = this.vertices[this.i % this.vertices.length];
        this.v2 = this.vertices[(this.i + 1) % this.vertices.length];
        this.i++;
        return this.i < this.vertices.length;
    };

    this.draw = function(){
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000000";
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.fillRect(0, 0, 500, 500);

        this.ctx.moveTo(this.v1.x, this.v1.y);
        this.ctx.lineTo(this.v2.x, this.v2.y);
        this.ctx.stroke();
    }
}

function animation_AllAtOnce(ctx, orderedVertices){
    this.ctx = ctx;
    this.vertices = orderedVertices;

    this.animate = function(){
        return false;
    }

    this.draw = function(){
        this.ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
        for(let i = 0 ; i < this.vertices.length; i++){
            let v = this.vertices[(i + 1) % this.vertices.length];
            this.ctx.lineTo(v.x, v.y);
        }
        this.ctx.stroke();
    }
}

function Config(){

    let self = this;
    
    self.angleOffset = - Math.PI / 2;
    
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    self.canvas = document.getElementById("screen");
    
    // limit to 500 px square
    self.canvas.width = Math.min(screenWidth - 10, 500);
    self.canvas.height = Math.min(screenHeight - 10, 500);

    self.ctx = self.canvas.getContext('2d');

    // resize canvas to adapt to the screen size
    let canvasWidth = self.canvas.width;
    let canvasHeight = self.canvas.height;

    // get the "center" position of the canvas
    self.cx = canvasWidth / 2;
    self.cy = canvasHeight / 2;

    // radius: minimum, so it won't "overflow" outside the canvas area
    self.r = Math.min(self.cx, self.cy) - 10;

    self.createVertices = function(cx, cy, r, n, angleOffset){
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

    self.getVerticesOrder = function(vertices, increment){
        let orderedVertices = [];
        for(let i = 0; i < vertices.length; i++){
            orderedVertices.push(vertices[i * increment % vertices.length]);
        }

        return orderedVertices;
    }

    self.config = function(){
        self.nVertices = 101;
        self.increment = 41;
        self.vertices = self.createVertices(self.cx, self.cy, self.r, self.nVertices, self.angleOffset);
        self.oVertices = self.getVerticesOrder(self.vertices, self.increment);
        self.iteration = 0;
        self.animations = [];
        self.animations.push( new animation_OneLineFading(self.ctx, self.oVertices) );
        self.animations.push( new animation_OneLineFading(self.ctx, self.oVertices) );
        self.animations.push( new animation_OneLineFading(self.ctx, self.oVertices) );
        self.animations.push( new animation_OneLine(self.ctx, self.oVertices) );
    }

    self.animate = function(){
        if(self.animations.length > 0){
            let keepDrawing = self.animations[0].animate();
            self.animations[0].draw();
            if(!keepDrawing){
                console.log("keep drawing = false; shifting animations...");
                self.animations.shift();
            }
            requestAnimationFrame(self.animate);
        }
        else{
            console.log("Finished!");
        }
    }
}

var config = new Config();

config.config();
requestAnimationFrame(config.animate);