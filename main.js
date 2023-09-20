let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

// all to do with selecting
var selecting = false;
var selectbox = null;

// adding new point
var creatingPoint = false;
var newPoint = null;

//moving points
var dragging = false;

let shapes = [];

canvas.width = window.innerWidth - 10;
canvas.height = window.innerHeight - 10;
canvas.style.border = '5px solid red';
context.lineWidth = 5

class Circle {
    constructor(xpoint, ypoint, radius, color){
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.radius = radius;
        this.color = color;
        this.strokeStyle = 'black';
        this.Path = new Path2D();
        this.text = shapes.length;
        this.selected = false;
    }

    draw(context) {
        //context.beginPath();
        this.Path = new Path2D();
        this.Path.arc(this.xpoint, this.ypoint, this.radius, 0, 2 * Math.PI);
        context.strokeStyle = this.strokeStyle;
        context.stroke(this.Path);
        context.fillStyle = this.color;
        context.fill(this.Path);
        context.fillStyle = 'black';
        context.fillText(this.text, this.xpoint, this.ypoint);
        //context.closePath();
    }
    
    select(context) {
        this.strokeStyle = 'blue';
        this.selected = true;
    }

    deselect(context) {
        this.strokeStyle = "black";
        this.selected = false;
    }
}

class SelectBox {
    constructor(xstart, ystart){
        this.xstart = xstart
        this.ystart = ystart
        this.xend = 0
        this.yend = 0
        this.Path = new Path2D();
    }

    draw(context){
        this.Path = new Path2D();
        context.strokeStyle = "blue";
        this.Path.rect(this.xstart, this.ystart, this.xend - this.xstart, this.yend - this.ystart)
        context.stroke(this.Path)
    }
}

let getObjectsInSelectBox = function(){
    for (let shape of shapes){
        //console.log(shape.text, shape.xpoint, shape.ypoint)
        if (shape.constructor.name == 'Circle'){
            //if ((shape.xpoint > selectbox.xstart) && (shape.xpoint < selectbox.xend) && (shape.ypoint > selectbox.ystart) && (shape.ypoint < selectbox.yend)){
            if (context.isPointInPath(selectbox.Path, shape.xpoint, shape.ypoint)){
                selectObject(shape)
            }
    }
    }
}


let getMouseOverObject = function(event){
    for (let shape of shapes.reverse()) {
        if (context.isPointInPath(shape.Path, event.offsetX, event.offsetY)) {
            shapes.reverse()
            return shape;
        }
    }
}

let selectObject = function(object){
    // push to the top of the picture
    if (object != null) {
        object.select();
        shapes.push(shapes.splice(shapes.indexOf(object), 1)[0]); 
    }
    //currentObject.color = 'green';
}

let deselectObjects = function(object){
    for (let shape of shapes){
        shape.deselect()
    }
}

let addPoint = function() {
    creatingPoint = true;
    newPoint = new Circle(200, 200, 25, 'gray')
    shapes.push(newPoint)
}

let createPoint = function() {
    let circle = new Circle(200, 200, 25, 'white');
    shapes.push(circle);

    console.log(shapes);
    drawPoints();
}

let deletePoint = function() {

    shapes = shapes.filter((shape) => shape.selected == false)
    drawPoints();

}

let drawPoints = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let shape of shapes) {
        shape.draw(context)
    }
    if (selectbox != null){
        selectbox.draw(context)
    }
}
/*
canvas.addEventListener('click', function(event) {
    if (creatingPoint) {
        newPoint.color = "white"
        newPoint = null;
        creatingPoint = false;
        return
    }
    if (selecting) {
        return
    }
    // Check whether point is inside circle
    console.log(event)
    //object = getMouseOverObject(event);
    selectObject(getMouseOverObject(event))
    drawPoints();
});  
*/
canvas.addEventListener('mousemove', function(event){
    if (creatingPoint) {
        newPoint.xpoint = event.offsetX;
        newPoint.ypoint = event.offsetY;
        drawPoints();
        return
    }
    if (dragging) {
        let temp = shapes.filter((shape) => shape.selected == true)
        for (let shape of temp ){
            shape.xpoint = event.offsetX;
            shape.ypoint = event.offsetY;
        }
        drawPoints();
        return
    }
    if (selecting) {
        selectbox.xend = event.offsetX;
        selectbox.yend = event.offsetY;
        drawPoints();
        getObjectsInSelectBox();
        return
    }
});

canvas.addEventListener('mouseup', function(event){
    console.log(event)
    if (selecting) {
        selecting = false;
        selectbox = null;
        drawPoints();
    }
    dragging = false;
});

canvas.addEventListener('mousedown', function(event){
    console.log(event)
    if (creatingPoint) {
        newPoint.color = "white"
        drawPoints();
        newPoint = null;
        creatingPoint = false;
        console.log("point set")
        return
    }
    // select clicked object, or if no object deselect all
    obj = getMouseOverObject(event)
    deselectObjects()
    if (obj != null) {
        selectObject(obj)
    }

    drawPoints();

    if (obj != null) {
        dragging = true;
    }
    else {
        selecting = true;
        selectbox = new SelectBox(event.offsetX, event.offsetY);
    }
});