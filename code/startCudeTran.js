var canvas; 
var gl;
 
var modelViewMatrixLoc;
var rotationMatrix;

function rotateZ(m,angle) {
	return  mult(m, rotate(angle, [0,0,1]));
}

function rotateX(m,angle) {
	return  mult(m, rotate(angle, [1,0,0]));
 }

 function rotateY(m,angle) {
	return  mult(m, rotate(angle, [0,1,0]));
 }

window.onload =  function init(){
	canvas = document.getElementById("canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if(!gl){alert("bowser do not support webgl");}
	
	gl.enable(gl.DEPTH_TEST);
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor(0.0,1.0,1.0,1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	
	var program = initShaders(gl,"vertex-shader","fragment-shader");
	gl.useProgram(program);
	
	 var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];
	
	
	var indices = [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
	];
	
	
	var iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint8Array(indices),
				  gl.STATIC_DRAW);
				  
	modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
	rotationMatrix = mat4();
	gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(rotationMatrix));
	var vBuffer = gl.createBuffer();
	var cBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	var vPosition = gl.getAttribLocation(program,"vPosition");	
	gl.vertexAttribPointer(vPosition,3,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vPosition);

	
	gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices),gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
 	var vColor = gl.getAttribLocation(program,"vColor");
	gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
	gl.enableVertexAttribArray(vColor);
	
	var vertexColors=[
	    [ 0.0, 0.0, 0.0, 1.0 ],  
        [ 1.0, 0.0, 0.0, 1.0 ],  
        [ 1.0, 1.0, 0.0, 1.0 ],   
        [ 0.0, 1.0, 0.0, 1.0 ],  
        [ 0.0, 0.0, 1.0, 1.0 ],   
        [ 1.0, 0.0, 1.0, 1.0 ],  
        [ 0.0, 1.0, 1.0, 1.0 ],  
        [ 1.0, 1.0, 1.0, 1.0 ]   
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors),gl.STATIC_DRAW);
	
	
	
	render();
}

function render(){
	setTimeout(function (){
	gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
	xangle =  document.getElementById("x").value;
	yangle =  document.getElementById("y").value;
	zangle =  document.getElementById("z").value;
    rotationMatrix = rotateX(rotationMatrix, xangle);
	rotationMatrix = rotateY(rotationMatrix, yangle);
	rotationMatrix = rotateZ(rotationMatrix, zangle);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(rotationMatrix));
	gl.drawElements(gl.TRIANGLES,36,gl.UNSIGNED_BYTE,0);
	requestAnimFrame(render);
	},100);
}	
