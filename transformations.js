//input
document.addEventListener("keydown", function(event) {
	switch(event.key) {
	case "w" :
		if (!transLock)
			translateZ(1);
		break;
	case "s" :
		if (!transLock)
			translateZ(-1);
		break;
	case "a" :
		if (!transLock)
			translateX(-1);
		break;
	case "d" :
		if (!transLock)
			translateX(1);
		break;
	case "j" :
		rotateView("y", 1);
		break;
	case "l" :
		rotateView("y", -1);
		break;
	case "i" :
		rotateView("x", 1);
		break;
	case "k" :
		rotateView("x", -1);
		break;
	case "u" :
		rotateView("z", 1);
		break;
	case "o" :
		rotateView("z", -1);
		break;
	case "+" :
		zoomIn();
		break;
	case "-" :
		zoomOut();
		break;
	case "v" :
		changeView();
		break;
	case "b" :
		viewRotation = mat4.create();
		mat4.rotateX(viewRotation, viewRotation, Math.PI/4);
		mat4.rotateY(viewRotation, viewRotation, -Math.PI/4);
		rotateView("x", 0);
		break;
		break;
	case "c" :
		toggleAxis = !toggleAxis;
		break;
	}
});
document.addEventListener("keyup", function(event){
	if (event.keyCode == 32 && gravity) {
		dropDown();
	}
	switch (event.key) {
	case "g" :
		toggleGrid = !toggleGrid;
		break;
	case "p" :
		gravity = !gravity;
		break;	
	case "f" :
		toggleShading = !toggleShading;
		if (toggleShading) {
			program = initShaders(gl, "phong-vertex-shader", "phong-fragment-shader");
			gl.useProgram(program);
			pMatrixLocation = gl.getUniformLocation(program, "PMatrix");
			mvMatrixLocation = gl.getUniformLocation(program, "MVMatrix");
			positionLocation = gl.getAttribLocation(program, "vertPosition");
			colorLocation = gl.getAttribLocation(program, "vcolor");
			normalLocation = gl.getAttribLocation(program, "vnormal");
			ambientLocation = gl.getUniformLocation(program, "ambient");
			diffuseLocation = gl.getUniformLocation(program, "diffuse");
			specularLocation = gl.getUniformLocation(program, "specular");
			reflectivenessLocation = gl.getUniformLocation(program, "reflectiveness");
			gl.uniform3fv(ambientLocation, 
					[document.getElementById("ambientR").value, document.getElementById("ambientG").value, document.getElementById("ambientB").value]); 
			gl.uniform3fv(diffuseLocation, [
				document.getElementById("diffuseR").value, document.getElementById("diffuseG").value, document.getElementById("diffuseB").value
				]); 
			gl.uniform3fv(specularLocation, [
				document.getElementById("specularR").value,  document.getElementById("specularG").value,  document.getElementById("specularB").value
				]); 
			gl.uniform1f(reflectivenessLocation, document.getElementById("reflectiveness").value);
			
			fieldProgram = initShaders(gl, "phong-vertex-shader", "phong-fragment-shader");
			fieldPMatrixLocation = gl.getUniformLocation(fieldProgram, "PMatrix");
			fieldMvMatrixLocation = gl.getUniformLocation(fieldProgram, "MVMatrix");
			fieldPositionLocation = gl.getAttribLocation(fieldProgram, "vertPosition");
			fieldColorLocation = gl.getAttribLocation(fieldProgram, "vcolor");
			fieldNormalLocation = gl.getAttribLocation(fieldProgram, "vnormal");
			fieldAmbientLocation = gl.getUniformLocation(fieldProgram, "ambient");
			fieldDiffuseLocation = gl.getUniformLocation(fieldProgram, "diffuse");
			fieldSpecularLocation = gl.getUniformLocation(fieldProgram, "specular");
			fieldReflectivenessLocation = gl.getUniformLocation(fieldProgram, "reflectiveness");
			gl.useProgram(fieldProgram);
			gl.uniform3fv(fieldAmbientLocation, 
					[document.getElementById("ambientR").value, document.getElementById("ambientG").value, document.getElementById("ambientB").value]); 
			gl.uniform3fv(fieldDiffuseLocation, [
				document.getElementById("diffuseR").value, document.getElementById("diffuseG").value, document.getElementById("diffuseB").value
				]); 
			gl.uniform3fv(fieldSpecularLocation, [
				document.getElementById("specularR").value,  document.getElementById("specularG").value,  document.getElementById("specularB").value
				]);  
			gl.uniform1f(fieldReflectivenessLocation, document.getElementById("reflectiveness").value);
		}
		else {
			program = initShaders(gl, "vertex-shader", "fragment-shader");
			gl.useProgram(program);
			pMatrixLocation = gl.getUniformLocation(program, "PMatrix");
			mvMatrixLocation = gl.getUniformLocation(program, "MVMatrix");
			positionLocation = gl.getAttribLocation(program, "vertPosition");
			colorLocation = gl.getAttribLocation(program, "vcolor");
			normalLocation = gl.getAttribLocation(program, "vnormal");
			ambientLocation = gl.getUniformLocation(program, "ambient");
			diffuseLocation = gl.getUniformLocation(program, "diffuse");
			specularLocation = gl.getUniformLocation(program, "specular");
			reflectivenessLocation = gl.getUniformLocation(program, "reflectiveness");
			gl.uniform3fv(ambientLocation, 
					[document.getElementById("ambientR").value, document.getElementById("ambientG").value, document.getElementById("ambientB").value]); 
			gl.uniform3fv(diffuseLocation, [
				document.getElementById("diffuseR").value, document.getElementById("diffuseG").value, document.getElementById("diffuseB").value
				]); 
			gl.uniform3fv(specularLocation, [
				document.getElementById("specularR").value,  document.getElementById("specularG").value,  document.getElementById("specularB").value
				]); 
			gl.uniform1f(reflectivenessLocation, document.getElementById("reflectiveness").value);

			fieldProgram = initShaders(gl, "vertex-shader", "fragment-shader");
			fieldPMatrixLocation = gl.getUniformLocation(fieldProgram, "PMatrix");
			fieldMvMatrixLocation = gl.getUniformLocation(fieldProgram, "MVMatrix");
			fieldPositionLocation = gl.getAttribLocation(fieldProgram, "vertPosition");
			fieldColorLocation = gl.getAttribLocation(fieldProgram, "vcolor");
			fieldNormalLocation = gl.getAttribLocation(fieldProgram, "vnormal");
			fieldAmbientLocation = gl.getUniformLocation(fieldProgram, "ambient");
			fieldDiffuseLocation = gl.getUniformLocation(fieldProgram, "diffuse");
			fieldSpecularLocation = gl.getUniformLocation(fieldProgram, "specular");
			fieldReflectivenessLocation = gl.getUniformLocation(fieldProgram, "reflectiveness");
			gl.useProgram(fieldProgram);
			gl.uniform3fv(fieldAmbientLocation, 
					[document.getElementById("ambientR").value, document.getElementById("ambientG").value, document.getElementById("ambientB").value]); 
			gl.uniform3fv(fieldDiffuseLocation, [
				document.getElementById("diffuseR").value, document.getElementById("diffuseG").value, document.getElementById("diffuseB").value
			]); 
			gl.uniform3fv(fieldSpecularLocation, [
				document.getElementById("specularR").value,  document.getElementById("specularG").value,  document.getElementById("specularB").value
				]);  
			gl.uniform1f(fieldReflectivenessLocation, document.getElementById("reflectiveness").value);
		}
		gl.useProgram(program);
		break;
	case "x" :
		if (!rotLock)
			rotateX(1);
		break;
	case "X" :
		if (!rotLock)
			rotateX(-1);
		break;
	case "y" :
		if (!rotLock)
			rotateY(1);
		break;
	case "Y" :
		if (!rotLock)
			rotateY(-1);
		break;
	case "z" :
		if (!rotLock)
			rotateZ(1);
		break;
	case "Z" :
		if (!rotLock)
			rotateZ(-1);
		break;
	}
});
document.getElementById("ambient").addEventListener("click", function(){
	var R = document.getElementById("ambientR").value;
	var G = document.getElementById("ambientG").value;
	var B = document.getElementById("ambientB").value;
	gl.useProgram(program);
	gl.uniform3fv(ambientLocation, [R, G, B]); 
	gl.useProgram(fieldProgram);
	gl.uniform3fv(fieldAmbientLocation, [R, G, B]);
	gl.useProgram(program);
});
document.getElementById("diffuse").addEventListener("click", function(){
	var R = document.getElementById("diffuseR").value;
	var G = document.getElementById("diffuseG").value;
	var B = document.getElementById("diffuseB").value;
	gl.useProgram(program);
	gl.uniform3fv(diffuseLocation, [R, G, B]); 
	gl.useProgram(fieldProgram);
	gl.uniform3fv(fieldDiffuseLocation, [R, G, B]); 
	gl.useProgram(program);
});
document.getElementById("specular").addEventListener("click", function(){
	var R = document.getElementById("specularR").value;
	var G = document.getElementById("specularG").value;
	var B = document.getElementById("specularB").value;
	gl.useProgram(program);
	gl.uniform3fv(specularLocation, [R, G, B]); 
	gl.useProgram(fieldProgram);
	gl.uniform3fv(fieldSpecularLocation, [R, G, B]);  
	gl.useProgram(program);
});
document.getElementById("reflec").addEventListener("click", function(){
	var r = document.getElementById("reflectiveness").value;
	gl.useProgram(program);
	gl.uniform1f(reflectivenessLocation, r); 
	gl.useProgram(fieldProgram);
	gl.uniform1f(fieldReflectivenessLocation, r);  
	gl.useProgram(program);
});

var transLock = false;
var last;
var delta = 0;
var xRotation = mat4.create();
var yRotation = mat4.create();
var zRotation = mat4.create();
var rotDirection = 0;
var rotated = 0;
var rotLock = false;

function animate(now) {
	now *= 0.001;
	delta = Math.round(Math.abs(now-last)*10000)/1000;
	last = now;
	var currRot = mat4.create();
	// X translation
	if (position[0] != translationMatrix[12]) {
		transLock = true;
		if (position[0] > translationMatrix[12]) { // right translation
			if (translationMatrix[12] + delta > position[0]) {
				mat4.translate(translationMatrix, translationMatrix, [position[0] - translationMatrix[12], 0, 0]);
				transLock = false;
			}
			else mat4.translate(translationMatrix, translationMatrix, [delta, 0, 0]);
		}
		else { // left translation
			if (translationMatrix[12] - delta < position[0]) { 
				mat4.translate(translationMatrix, translationMatrix, [-Math.abs(translationMatrix[12] - position[0]), 0, 0]);
				transLock = false;
			}
			else mat4.translate(translationMatrix, translationMatrix, [-delta, 0, 0]);
		}
	}
	else transLock = false;
	// Y translation
	if (position[1] != translationMatrix[13]) {
		if (translationMatrix[13] - delta < position[1]) {
			mat4.translate(translationMatrix, translationMatrix, [0, -Math.abs(translationMatrix[13] - position[1]), 0]);
		}
		else mat4.translate(translationMatrix, translationMatrix, [0, -delta, 0]);
	}
	// Z translation
	if (position[2] != translationMatrix[14]) {
		transLock = true;
		if (position[2] > translationMatrix[14]) { // front translation
			if (translationMatrix[14] + delta > position[2]) {
				mat4.translate(translationMatrix, translationMatrix, [0, 0, position[2] - translationMatrix[14]]);
				transLock = false;
			}
			else mat4.translate(translationMatrix, translationMatrix, [0, 0, delta]);
		}
		else { // back translation
			if (translationMatrix[14] - delta < position[2]) { 
				mat4.translate(translationMatrix, translationMatrix, [0, 0, -Math.abs(translationMatrix[14] - position[2])]);
				transLock = false;
			}
			else mat4.translate(translationMatrix, translationMatrix, [0, 0, -delta]);
		}
	}
	else transLock = false;
	// X rotation
	if (Math.round(xRotation[5]*1000) != Math.round(Math.cos(rotation[0])*1000) && Math.round(xRotation[6]*1000) != -Math.round(Math.sin(rotation[0])*1000)) {
		rotLock = true;
		if (rotated + delta > Math.PI/2) {
			mat4.rotateX(xRotation, xRotation, rotDirection*(Math.PI/2-rotated));
			mat4.rotateX(currRot, currRot, rotDirection*(Math.PI/2-rotated));
			rotated = 0;
			rotLock = false;
		}
		else {
			mat4.rotateX(xRotation, xRotation, rotDirection*delta);
			mat4.rotateX(currRot, currRot, rotDirection*delta);
			rotated += delta;
		}
	}
	// Y rotation
	if (Math.round(yRotation[0]*1000) != Math.round(Math.cos(rotation[1])*1000) && Math.round(yRotation[8]*1000) != -Math.round(Math.sin(rotation[1])*1000)) {
		rotLock = true;
		if (rotated + delta > Math.PI/2) {
			mat4.rotateY(yRotation, yRotation, rotDirection*(Math.PI/2-rotated));
			mat4.rotateY(currRot, currRot, rotDirection*(Math.PI/2-rotated));
			rotated = 0;
			rotLock = false;
		}
		else {
			mat4.rotateY(yRotation, yRotation, rotDirection*delta);
			mat4.rotateY(currRot, currRot, rotDirection*delta);
			rotated += delta;
		}
	}
	// Z rotation
	if (Math.round(zRotation[0]*1000) != Math.round(Math.cos(rotation[2])*1000) && Math.round(zRotation[1]*1000) != -Math.round(Math.sin(rotation[2])*1000)) {
		rotLock = true;
		if (rotated + delta > Math.PI/2) {
			mat4.rotateZ(zRotation, zRotation, rotDirection*(Math.PI/2-rotated));
			mat4.rotateZ(currRot, currRot, rotDirection*(Math.PI/2-rotated));
			rotated = 0;
			rotLock = false;
		}
		else {
			mat4.rotateZ(zRotation, zRotation, rotDirection*delta);
			mat4.rotateZ(currRot, currRot, rotDirection*delta);
			rotated += delta;
		}
	}
	mat4.multiply(rotationMatrix, currRot, rotationMatrix);
	mat4.multiply(mvMatrix, translationMatrix, rotationMatrix);
	
	gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);
	draw();
	requestAnimationFrame(animate);
}

function translateX(direction) {
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++) 
				if (currentShapeArray[x][y][z] != 0)
					if (arrayPosition[0]+x-direction > 5 || arrayPosition[0]+x-direction < 0 || 
							field[arrayPosition[0]+x-direction][arrayPosition[1]+y][arrayPosition[2]+z] != 0)
						return;
	arrayPosition[0] -= direction;
	position[0] += direction;
}

function translateZ(direction) {
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++) 
				if (currentShapeArray[x][y][z] != 0)
					if (arrayPosition[2]+z-direction > 5 || arrayPosition[2]+z-direction < 0 || 
							field[arrayPosition[0]+x][arrayPosition[1]+y][arrayPosition[2]+z-direction] != 0)
						return;
	arrayPosition[2] -= direction;
	position[2] += direction;
}

function translateY() {
	var bottom = false;
	if (gravity) {
		for (var x=0; x<4; x++)
			for (var y=0; y<4; y++)
				for (var z=0; z<4; z++) 
					if (currentShapeArray[x][y][z] != 0)
						if (arrayPosition[1]+y+1 > 11 || 
								field[arrayPosition[0]+x][arrayPosition[1]+y+1][arrayPosition[2]+z] != 0)
							bottom = true;
		if (!bottom) {
			arrayPosition[1]++;
			position[1]--;
		}
		else updateGrid();
	}
}

function dropDown() {
	var counter = 0;
	var drop = 12;
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++) 
				if (currentShapeArray[x][y][z] != 0) {
					for (var i=1; i<12-arrayPosition[1]; i++)
						if (arrayPosition[1]+y+i < 12 && 
								field[arrayPosition[0]+x][arrayPosition[1]+y+i][arrayPosition[2]+z] == 0)
							counter++;
						else break;
					if (counter < drop) drop = counter;
					counter = 0;
				}
	position[1] -= drop;
	arrayPosition[1] += drop;
	updateGrid();
}

function rotateX(direction) {
	var arr = copy(currentShapeArray);
	for (var x=0; x<4; x++) {
		if (direction == 1) {
			for (var y=0; y<4; y++)
				arr[x][y].reverse();
		}
		else {
			arr[x].reverse();
		}
	}
	transpose(arr, "x");
	if (acceptablePosition(arr)) {
		currentShapeArray = arr;
		rotation[0] += direction*Math.PI/2;
		rotDirection = direction;
	}
}

function rotateY(direction) {
	var arr = copy(currentShapeArray);
	if (direction == 1)
	arr.reverse();
	else {
		for (var x=0; x<4; x++)
			for (var y=0; y<4; y++)
				arr[x][y].reverse();
	}
	transpose(arr, "y");
	if (acceptablePosition(arr)) {
		currentShapeArray = arr;
		rotation[1] += direction*Math.PI/2;
		rotDirection = direction;
	}
}

function rotateZ(direction) {
	var arr = copy(currentShapeArray);
	if (direction == 1)
		for (var x=0; x<4; x++)
			arr[x].reverse();
		else arr.reverse();
	transpose(arr, "z");
	if (acceptablePosition(arr)) {
		currentShapeArray = arr;
		rotation[2] += direction*Math.PI/2;
		rotDirection = direction;
	}
}

function rotateView(axis, direction) {
	switch (axis) {
	case "x" :
		mat4.rotateX(viewRotation, viewRotation, direction*Math.PI/90);
		break;
	case "y" :
		mat4.rotateY(viewRotation, viewRotation, direction*Math.PI/90);
		break;
	case "z" :
		mat4.rotateZ(viewRotation, viewRotation, direction*Math.PI/90);
		break;
	}
	if (perspective)
	mat4.multiply(pMatrix, perspMatrix, viewRotation);
	else {
		mat4.scale(pMatrix, orthoMatrix, [1/zoom, 1/zoom, 1/zoom]);
		mat4.multiply(pMatrix, pMatrix, viewRotation);
	}
	
		var edge1 = vec4.fromValues(-3, 5, 3, 1);
		vec4.transformMat4(edge1, edge1, pMatrix);
		var edge2 = vec4.fromValues(3, 5, 3, 1);
		vec4.transformMat4(edge2, edge2, pMatrix);
		var edge3 = vec4.fromValues(3, 5, -3, 1);
		vec4.transformMat4(edge3, edge3, pMatrix);
		var edge4 = vec4.fromValues(-3, 5, -3, 1);
		vec4.transformMat4(edge4, edge4, pMatrix);
		var edge5 = vec4.fromValues(-3, -5, 3, 1);
		vec4.transformMat4(edge5, edge5, pMatrix);
		var edge6 = vec4.fromValues(3, -5, 3, 1);
		vec4.transformMat4(edge6, edge6, pMatrix);
		var edge7 = vec4.fromValues(3, -5, -3, 1);
		vec4.transformMat4(edge7, edge7, pMatrix);
		var edge8 = vec4.fromValues(-3, -5, -3, 1);
		vec4.transformMat4(edge8, edge8, pMatrix);
		
		var gridHelp = new Array();
		wireframeVert = new Array();
		if (edge2[2] < edge1[2] && edge3[2] < edge4[2] && edge6[2] < edge5[2] && edge7[2] < edge8[2]) {
			wireframeVert = wireframeVert.concat(wf[5]);
			gridHelp = gridHelp.concat(grid[5]);
		}
		else {
			wireframeVert = wireframeVert.concat(wf[4]);
			gridHelp = gridHelp.concat(grid[4]);
		}
		if (edge1[2] < edge4[2] && edge2[2] < edge3[2] && edge5[2] < edge8[2] && edge6[2] < edge7[2]) {
			wireframeVert = wireframeVert.concat(wf[3]);
			gridHelp = gridHelp.concat(grid[3]);
		}
		else {
			gridHelp = gridHelp.concat(grid[2]);
			wireframeVert = wireframeVert.concat(wf[2]);
		}
		if (edge1[2] < edge5[2] && edge2[2] < edge6[2] && edge3[2] < edge7[2] && edge4[2] < edge8[2]) {
			wireframeVert = wireframeVert.concat(wf[0]);
			gridHelp = gridHelp.concat(grid[0]);
		}
		else {
			wireframeVert = wireframeVert.concat(wf[1]);
			gridHelp = gridHelp.concat(grid[1]);
		}
			gridVert = gridHelp;
}

function changeView() {
	perspective = !perspective;
	if (perspective) {
		mat4.perspective(perspMatrix, 45, gl.viewportWidth/gl.viewportHeight, 0.1, 100);
		mat4.translate(perspMatrix, perspMatrix, [0, 0, -15+(1-zoom)*10]);
		mat4.multiply(pMatrix, perspMatrix, viewRotation);
	}
	else {
		mat4.scale(pMatrix, orthoMatrix, [1/zoom, 1/zoom, 1/zoom]);
		mat4.multiply(pMatrix, pMatrix, viewRotation);
	}
}

function zoomIn() {
	if (zoom > 0.3) {
		zoom -= 0.1;
		if (perspective) {
			mat4.translate(perspMatrix, perspMatrix, [0, 0, 1])
			mat4.multiply(pMatrix, perspMatrix, viewRotation);
		}
		else {
			mat4.scale(pMatrix, orthoMatrix, [1/zoom, 1/zoom, 1/zoom]);
			mat4.multiply(pMatrix, pMatrix, viewRotation);	
		}
	}
		
}

function zoomOut() {
	if (zoom < 2) {
		zoom += 0.1;
		if (perspective) {
			mat4.translate(perspMatrix, perspMatrix, [0, 0, -1])
			mat4.multiply(pMatrix, perspMatrix, viewRotation);
		}
		else {
			mat4.scale(pMatrix, orthoMatrix, [1/zoom, 1/zoom, 1/zoom]);
			mat4.multiply(pMatrix, pMatrix, viewRotation);
		}
	}
}

function transpose(arr, axis) {
	switch (axis) {
	case "x" :
		for (var x=0; x<4; x++) {
			var e1=arr[x][0][1], e2=arr[x][0][2], e3=arr[x][0][3], e6=arr[x][1][2], e7=arr[x][1][3], e11=arr[x][2][3];
			for (var k=0; k<4; k++) {
				for (var j=0; j<4; j++) 
					arr[x][k][j] = arr[x][j][k];
			}
			arr[x][1][0] = e1;
			arr[x][2][0] = e2;
			arr[x][3][0] = e3;
			arr[x][2][1] = e6;
			arr[x][3][1] = e7;
			arr[x][3][2] = e11;
		}
		break;
	case "y" :
		for (var y=0; y<4; y++) {
			var e1=arr[0][y][1], e2=arr[0][y][2], e3=arr[0][y][3], e6=arr[1][y][2], e7=arr[1][y][3], e11=arr[2][y][3];
			for (var k=0; k<4; k++) {
				for (var j=0; j<4; j++)
					arr[k][y][j] = arr[j][y][k];
			}
			arr[1][y][0] = e1;
			arr[2][y][0] = e2;
			arr[3][y][0] = e3;
			arr[2][y][1] = e6;
			arr[3][y][1] = e7;
			arr[3][y][2] = e11;
		}
		break;
	case "z" :
		for (var z=0; z<4; z++) {
			var e1=arr[0][1][z], e2=arr[0][2][z], e3=arr[0][3][z], e6=arr[1][2][z], e7=arr[1][3][z], e11=arr[2][3][z];
			for (var k=0; k<4; k++) {
				for (var j=0; j<4; j++)
					arr[k][j][z] = arr[j][k][z];
			}
			arr[1][0][z] = e1;
			arr[2][0][z] = e2;
			arr[3][0][z] = e3;
			arr[2][1][z] = e6;
			arr[3][1][z] = e7;
			arr[3][2][z] = e11;
		}
	}
}

function acceptablePosition(arr) {
	for (var x=0; x<4; x++)
		for (var y=0; y<4; y++)
			for (var z=0; z<4; z++) 
				if (arr[x][y][z] != 0)
					if (arrayPosition[0]+x < 0 || arrayPosition[0]+x > 5 ||
							arrayPosition[1]+y > 11 || 
							arrayPosition[2]+z < 0 || arrayPosition[2]+z > 5 ||
							field[arrayPosition[0]+x][arrayPosition[1]+y][arrayPosition[2]+z] != 0)
						return false;
	return true;
}

function copy(arr) {
	var help = new Array();
	for (var x=0; x<4; x++) {
		help[x] = [];
		for(var y=0; y<4; y++){
			help[x][y] = [];
			for(var z=0; z<4; z++)
				help[x][y][z] = arr[x][y][z];
		}
	}
	return help;
}


