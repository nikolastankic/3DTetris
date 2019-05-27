var canvas;
var gl;
var program;
var mvMatrix;
var pMatrix;
var positionBuffer;
var colorBuffer;
var normalBuffer;

var positionLocation;
var colorLocation;
var normalLocation;
var mvMatrixLocation;
var pMatrixLocation;
var ambientLocation;
var diffuseLocation;
var specularLocation;
var reflectivenessLocation;

//grid
var gridProgram;
var gridPositionBuffer;
var gridMvMatrix = mat4.create();
var gridPositionLocation;
var gridColorLocation;
var gridMvMatrixLocation;
var gridPMatrixLocation;
var toggleGrid = true;
var grid; //all line points on the wireframe
var gridVert = new Array(); //currently visible grid lines
var wf; //all edges of the wireframe
var wireframeVert = new Array(); //currently visible edges of the wireframe
var toggleAxis = true;

var translationMatrix = mat4.create();
var rotationMatrix = mat4.create();
var rotation = [0, 0, 0];
var position = [0, 5, 0];
var perspective = false; //view toggle
var viewRotation = mat4.create();
var orthoMatrix = mat4.create();
var perspMatrix = mat4.create();
var gravity = true;
var zoom = 1; //zoom factor

//field and blocks
var field;
var blocks = new Array();
var blocksVerts = new Array();
var blocksColors;
var blocksNormals;
var currentShape;
var currentShapeArray;
var arrayPosition = [1, 0, 1];
var fieldProgram;
var fieldPositionBuffer;
var fieldColorBuffer;
var fieldNormalBuffer;
var fieldPositionLocation;
var fieldNormalLocation;
var fieldColorLocation;
var fieldMvMatrixLocaction;
var fieldPMatrixLocation;
var fieldAmbientLocation;
var fieldDiffuseLocation;
var fieldSpecularLocation;
var fieldReflectivenessLocation;
var timer;
var anim;
var toggleShading = true;

var start = function() {
	canvas = document.getElementById('grid');
	gl = canvas.getContext('webgl');
	gl.viewportWidth = canvas.width;
	gl.viewportHeight = canvas.height;
	program = initShaders(gl, "phong-vertex-shader", "phong-fragment-shader");
	gridProgram = initShaders(gl, "grid-vertex", "grid-fragment");
	fieldProgram = initShaders(gl, "phong-vertex-shader", "phong-fragment-shader");
	
	//grid locations
	gridPMatrixLocation = gl.getUniformLocation(gridProgram, "PMatrix");
	gridMvMatrixLocation = gl.getUniformLocation(gridProgram, "MVMatrix");
	gridPositionLocation = gl.getAttribLocation(gridProgram, "vertPosition");
	gridColorLocation = gl.getUniformLocation(gridProgram, "color");
	//shape locations
	pMatrixLocation = gl.getUniformLocation(program, "PMatrix");
	mvMatrixLocation = gl.getUniformLocation(program, "MVMatrix");
	positionLocation = gl.getAttribLocation(program, "vertPosition");
	colorLocation = gl.getAttribLocation(program, "vcolor");
	normalLocation = gl.getAttribLocation(program, "vnormal");
	ambientLocation = gl.getUniformLocation(program, "ambient");
	diffuseLocation = gl.getUniformLocation(program, "diffuse");
	specularLocation = gl.getUniformLocation(program, "specular");
	reflectivenessLocation = gl.getUniformLocation(program, "reflectiveness");
	//field locations
	fieldPMatrixLocation = gl.getUniformLocation(fieldProgram, "PMatrix");
	fieldMvMatrixLocation = gl.getUniformLocation(fieldProgram, "MVMatrix");
	fieldPositionLocation = gl.getAttribLocation(fieldProgram, "vertPosition");
	fieldColorLocation = gl.getAttribLocation(fieldProgram, "vcolor");
	fieldNormalLocation = gl.getAttribLocation(fieldProgram, "vnormal");
	fieldAmbientLocation = gl.getUniformLocation(fieldProgram, "ambient");
	fieldDiffuseLocation = gl.getUniformLocation(fieldProgram, "diffuse");
	fieldSpecularLocation = gl.getUniformLocation(fieldProgram, "specular");
	fieldReflectivenessLocation = gl.getUniformLocation(fieldProgram, "reflectiveness");
	
	gl.useProgram(program);
	gl.uniform3fv(ambientLocation, [0.2, 0.2, 0.2]); 
	gl.uniform3fv(diffuseLocation, [1.0, 1.0, 1.0]); 
	gl.uniform3fv(specularLocation, [2.0, 2.0, 2.0]); 
	gl.uniform1f(reflectivenessLocation, 10.0);
	gl.useProgram(fieldProgram);
	gl.uniform3fv(fieldAmbientLocation, [0.2, 0.2, 0.2]); 
	gl.uniform3fv(fieldDiffuseLocation, [1.0, 1.0, 1.0]); 
	gl.uniform3fv(fieldSpecularLocation, [2.0, 2.0, 2.0]);  
	gl.uniform1f(fieldReflectivenessLocation, 10.0);
	
	fieldPositionBuffer = gl.createBuffer();
	fieldColorBuffer = gl.createBuffer();
	fieldNormalBuffer = gl.createBuffer();
	
	grid = wireframe();
	wf = getWireframe();
	wireframeVert = wireframeVert.concat(wf[0],wf[3],wf[5]);
	gridVert = gridVert.concat(grid[0], grid[3], grid[5]);
	gridPositionBuffer = gl.createBuffer();
	
	currentShape = ~~(Math.random()*8+1);
	currentShapeArray = shapeArray(currentShape);
	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVert(currentShape)), gl.STATIC_DRAW);
	colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColor()), gl.STATIC_DRAW);
	normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getNormals()), gl.STATIC_DRAW);
	
	pMatrix = mat4.create();
	mat4.ortho(orthoMatrix, -gl.viewportWidth/80, gl.viewportWidth/80, -gl.viewportHeight/80, gl.viewportHeight/80, -100, 100);
	mat4.perspective(perspMatrix, 45, gl.viewportWidth/gl.viewportHeight, 0.1, 100);
	mat4.translate(perspMatrix, perspMatrix, [0, 0, -15]);
	mat4.rotateX(viewRotation, viewRotation, Math.PI/2);
	mat4.multiply(pMatrix, orthoMatrix, viewRotation);
	
	mvMatrix = mat4.create();
	mat4.translate(translationMatrix, translationMatrix, [0, 5, 0]);
	mat4.multiply(mvMatrix, translationMatrix, mvMatrix);
	
	initField();
	draw();
	timer = setInterval(translateY, 750);
	anim = requestAnimationFrame(animate);
	
}

function draw() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
	gl.useProgram(gridProgram);
	
	gl.uniformMatrix4fv(gridPMatrixLocation, false, pMatrix);
	gl.uniformMatrix4fv(gridMvMatrixLocation, false, gridMvMatrix);
	gl.uniform4fv(gridColorLocation, [0, 0, 0, 1]); 
	
	gl.bindBuffer(gl.ARRAY_BUFFER, gridPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wireframeVert), gl.STATIC_DRAW);
	gl.vertexAttribPointer(
			gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(gridPositionLocation);
	
	gl.drawArrays(gl.LINES, 0, 24);
	if (toggleAxis) {
		//X
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-53, -5, -3,
			-3, -5, -3,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [0, 1, 1, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-3, -5, -3,
			47, -5, -3,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [0, 0.5, 0, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
		//Y
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-3, -55, -3,
			-3, -5, -3,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [0.5, 0.5, 0, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-3, -5, -3,
			-3, 45, -3,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [1, 0, 0, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
		//Z
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-3, -5, -53,
			-3, -5, -3,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [1, 0, 1, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
			-3, -5, -3,
			-3, -5, 57,
		]), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [0, 0, 1, 1]); 
		gl.drawArrays(gl.LINES, 0, 2);
	}
	
	if (toggleGrid) {
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridVert), gl.STATIC_DRAW);
		gl.vertexAttribPointer(
				gridPositionLocation, 3, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(gridPositionLocation);
		gl.uniform4fv(gridColorLocation, [1, 1, 1, 0]); 

		gl.drawArrays(gl.LINES, 0, 100);
		
	}
	
	//draw the field
	gl.useProgram(fieldProgram);
	
	gl.uniformMatrix4fv(fieldPMatrixLocation, false, pMatrix);
	gl.uniformMatrix4fv(fieldMvMatrixLocation, false, gridMvMatrix);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldPositionBuffer);
	gl.vertexAttribPointer(
			fieldPositionLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(fieldPositionLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldColorBuffer);
	gl.vertexAttribPointer(
			fieldColorLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(fieldColorLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldNormalBuffer);
	gl.vertexAttribPointer(
			fieldNormalLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(fieldNormalLocation);
	if(blocksVerts.length != 0)
	gl.drawArrays(gl.TRIANGLES, 0, blocksVerts.length/3);
	
	//draw current shape
	gl.useProgram(program);
	
	gl.uniformMatrix4fv(pMatrixLocation, false, pMatrix);
	gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(
			positionLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(
			colorLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(colorLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(
			normalLocation, 3, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(normalLocation);
	
	gl.drawArrays(gl.TRIANGLES, 0, 144);
}

function initField() {
	field = [];
	for (var x=0; x<6; x++){
		field[x] = [];
		for (var y=0; y<12; y++){
			field[x][y] = [];
			for (var z=0; z<6; z++)
				field[x][y][z] = 0;
		}
	}
}

function updateGrid() {
	var col = [Math.random(), Math.random(), Math.random()];
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++)
				if (currentShapeArray[x][y][z] != 0) {
					field[arrayPosition[0]+x][arrayPosition[1]+y][arrayPosition[2]+z] = currentShapeArray[x][y][z];
					var block = new Object();
					block.pos = [arrayPosition[0]+x,arrayPosition[1]+y,arrayPosition[2]+z];
					block.Vert = blockVert(block.pos);
					block.Color = [col[0], col[1], col[2]];
					block.Normals = blockNormals();
					blocks = blocks.concat(block);
				}
	clearSlice();
	blocksVerts = new Array();
	blocksColors = new Array();
	blocksNormals = new Array();
	for (var i=0; i<blocks.length; i++) {
		blocksVerts = blocksVerts.concat(blocks[i].Vert);
		blocksColors = blocksColors.concat(colorsArray(blocks[i].Color));
		blocksNormals = blocksNormals.concat(blocks[i].Normals);
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blocksVerts), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blocksColors), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, fieldNormalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(blocksNormals), gl.STATIC_DRAW);
	//reset current shape position data
	arrayPosition = [1, 0, 1];
	position = [0, 5, 0];
	rotation = [0, 0, 0];
	translationMatrix = mat4.create();
	mat4.translate(translationMatrix, translationMatrix, [0, 5, 0]);
	rotationMatrix = mat4.create();
	xRotation = mat4.create();
	yRotation = mat4.create();
	zRotation = mat4.create();
	//spawn a new shape
	spawn();
}

function clearSlice() {
	var counter = 0;
	var empty = 0;
	for (var y=11; y>1; y--) {
		for (var x=0; x<6; x++)
			for (var z=0; z<6; z++) {
				if (field[x][y][z] != 0) {
					counter++
					empty = 0;
				}
				else empty++;
			}
		if (counter == 36) {
			for (var i=0; i<blocks.length; i++) {
				if (blocks[i].pos[1] == y)
					blocks.splice(i--, 1);
				else if (blocks[i].pos[1] < y) {
					blocks[i].pos[1]++;
					blocks[i].Vert = blockVert(blocks[i].pos);
				}
			}
			for (var i=y; i>1; i--)
				for (var x=0; x<6; x++)
					for (var z=0; z<6; z++)
						field[x][i][z] = field[x][i-1][z];
		}
		counter = 0;
		if (empty > 72) break;
	}
}

function spawn() {
	currentShape = ~~(Math.random()*8+1);
	currentShapeArray = shapeArray(currentShape);
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++) 
				if (currentShapeArray[x][y][z] != 0)
					if(field[arrayPosition[0]+x][arrayPosition[1]+y][arrayPosition[2]+z] != 0) {
						clearInterval(timer);
						window.open ("gameover.html","_self",false);
					}
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getVert(currentShape)), gl.STATIC_DRAW);
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getColor()), gl.STATIC_DRAW);
}