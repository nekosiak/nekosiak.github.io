

var canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');
var frameRate = 100.0;
var frameDelay = 1000.0/frameRate;
var clientWidth = innerWidth;
var clientHeight = innerHeight;

canvas.width = clientWidth;
canvas.height = clientHeight;

//Max and min values on axis X&Y
__min_X = -20;
__min_Y = -10;
__max_X = 20;
__max_Y = 10;

//key 
var key = "x*x";
timer = null;

defObor = 0;
hodObor = 0;

__timing = -2;

__globalSteps = 0.0003; //Steps to draw the function
__graphLineHeight = 5;

__ABS_X = Math.abs(__min_X) + Math.abs(__max_X);
__ABS_Y = Math.abs(__min_Y) + Math.abs(__max_Y);

__ZERO = { 'x': clientWidth / __ABS_X * Math.abs(__min_X), 'y': clientHeight / __ABS_Y * Math.abs(__min_Y), }

__ABSOLUTE_X = 40;
__ABSOLUTE_Y = 20;

__COLOR = ['white', 'black'];
__CUR_COLOR = 0;

__GRAPHS = [];
__GRAPH_COLORS = ['#FFFFFF', '#000000', '#0000ff', '#00ff00', '#ff0000', '#00ffff', '#ffff00', '#0000ff', '#804000', '#fdaf07', '#8500bb', '#fd9b9a', '#7e0003'];
__GRAPH_CUR_COLOR = 0;

updateAxis = function(minX, minY, maxX, maxY) {
	__min_X = minX;
	__min_Y = minY;
	__max_X = maxX;
	__max_Y = maxY;

	__ABS_X = Math.abs(__min_X) + Math.abs(__max_X);
	__ABS_Y = Math.abs(__min_Y) + Math.abs(__max_Y);

	__ZERO = { 'x': clientWidth / __ABS_X * Math.abs(__min_X), 'y': clientHeight / __ABS_Y * Math.abs(__min_Y), }

	update();
}

Graph = function() {
	this.graph = 0;
	this.color = 0;
}

graphPoints = function() {
	if ($('#loading').is(':visible')) $('#loading').hide();
	ctx.lineWidth = 0;

	//Draw points on X axis
	for (var i = -__ABSOLUTE_X/2; i <= __ABSOLUTE_X/2; i++) {
		var step = (clientWidth / __ABSOLUTE_X) * (i + Math.abs(-__ABSOLUTE_X/2));
		ctx.strokeStyle = ctx.fillStyle = __COLOR[__CUR_COLOR];

		if (i == 0) {
			ctx.beginPath();
				ctx.moveTo(step, 0);
				ctx.lineTo(step, clientHeight);
				ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
			ctx.moveTo(step, -__graphLineHeight + __ZERO['y']);
			ctx.lineTo(step, __graphLineHeight + __ZERO['y']);
			if (i != 0) { text(step, __graphLineHeight*3 + __ZERO['y']+2, __COLOR[__CUR_COLOR], 'center', '12px arial', (__ABS_X/__ABSOLUTE_X)*i); } else {
				text(step-9, __graphLineHeight*3 + __ZERO['y']+3, __COLOR[__CUR_COLOR], 'center', '12px arial', i);
			}
			ctx.stroke();
		ctx.closePath();
	};

	//Draw points on Y axis
	for (var i = -__ABSOLUTE_Y/2; i <= __ABSOLUTE_Y/2; i++) {
		var step = (clientHeight / __ABSOLUTE_Y) * (i + Math.abs(-__ABSOLUTE_Y/2));
		ctx.strokeStyle = ctx.fillStyle = __COLOR[__CUR_COLOR];

		if (i == 0) {
			ctx.beginPath();
				ctx.moveTo(0, step);
				ctx.lineTo(clientWidth, step);
				ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
			ctx.moveTo(-__graphLineHeight + __ZERO['x'], step);
			ctx.lineTo(__graphLineHeight + __ZERO['x'], step);
			if (i != 0) { text(__graphLineHeight*3.5  + __ZERO['x'], step+3, __COLOR[__CUR_COLOR], 'center', '12px arial', (__ABS_Y/__ABSOLUTE_Y)*i*-1); }
			ctx.stroke();
		ctx.closePath();
	};

	//Create equation for function
	ctx.beginPath();

		var begin = false;

		for(var i = 0; i < __GRAPHS.length; i++) {
			ctx.strokeStyle = __GRAPH_COLORS[__GRAPHS[i].color];

			for(var x = __min_X + __globalSteps; x <= __max_X; x += __globalSteps) {

				var xperc = clientWidth / __ABS_X;
				var yperc = clientHeight / __ABS_Y;

				var xAxis = x*xperc + __ZERO['x'];
				var yAxis = eval(__GRAPHS[i].graph)*-1*yperc + __ZERO['y'];

				ctx.strokeRect(xAxis, yAxis, 0.01, 0.01);
			}
		}

	ctx.closePath();
}

/****     UPDATE     ****/
update = function() {
	
	/* DRAWING CANVAS AS BLACK SCREEN */
	if (__CUR_COLOR == 0)
		ctx.fillStyle = __COLOR[1];
	else ctx.fillStyle = __COLOR[0];
	ctx.fillRect(0, 0, clientWidth, clientHeight);
	ctx.globalAlpha = 1;

	/* RUN GRAPH */
	graphPoints();
}

update();

updateMenu = function() {
	var str = '';
	for(var i = 0; i < __GRAPHS.length; i++) {
		str = str + '<div class="graph"><div class="graph_text">GRAPH ' + (i+1) + '</div><div style="background:' + __GRAPH_COLORS[__GRAPHS[i].color] + ';" class="graph_color"></div><div class="graph_edit"></div><div class="graph_delete"></div><div class="graph_id">' + i + '</div></div>';
	}

	str = str + '<div class="add_graph">ADD GRAPH</div>';

	$('#graphs').html('' + str);
}

$(document).ready(function() {
	$('.default').click(function() {
		$('#loading').show();
		setTimeout(function() {
			__timing = -2;
			updateAxis(-20, -10, 20, 10);
		}, 20);
	});

	$('.plus').click(function() {
			if (__timing+1 <= -1) {
				$('#loading').show();
				setTimeout(function() {
					__timing = __timing+1;
					if (__timing < 0) updateAxis(10*__timing, 5*__timing, -10*__timing, -5*__timing);
				}, 20);
			}
	});

	$('.minus').click(function() {
		$('#loading').show();
		setTimeout(function() {
			if (__timing-1 == 0) updateAxis(-20, -10, 20, 10); else {
				__timing = __timing-1;
				if (__timing < 0) updateAxis(10*__timing, 5*__timing, -10*__timing, -5*__timing);
			}
		}, 20);
	});

	$('.color_change').click(function() {
		$('#loading').show();
		setTimeout(function() {
			if (__CUR_COLOR == 0) {
				$('.color_change').attr('src', '../img/color_2.png');
				$('html, body').css('color', 'black');
				__CUR_COLOR = 1;
			} else {
				$('.color_change').attr('src', '../img/color_1.png');
				$('html, body').css('color', 'white');
				__CUR_COLOR = 0;
			}

			update();
		}, 20);
	});

	$('#add_graph_form').hide();
	$('#loading').hide();

	$('.color, .color_edit').click(function() {
		if (__GRAPH_CUR_COLOR+1 > __GRAPH_COLORS.length-1) __GRAPH_CUR_COLOR = 0; else __GRAPH_CUR_COLOR += 1;
		$(this).attr('style', 'background:' + __GRAPH_COLORS[__GRAPH_CUR_COLOR] + '');
	});

	$('.function_back, .function_back_edit').click(function() {
		$('#add_graph_form').fadeOut();
		$('#Function').val('');
		__GRAPH_CUR_COLOR = 0;
		$('#Function').attr('style', '');
	});

	$('.function_submit').click(function() {
		if ($('#Function').val() != '') {
			this.v = false;
			
			val = $('#Function').val();

			var array = {"abs":"Math.abs", "pow":"Math.pow", "sqrt":"Math.sqrt", "round":"Math.round",
			"floor":"Math.floor", "ceil":"Math.ceil", "sin":"Math.sin", "asin":"Math.asin",
			"cos":"Math.cos", "acos":"Math.acos", "tan":"Math.tan", "atan":"Math.atan",
			"atan2":"Math.atan2", "exp":"Math.exp", "log":"Math.log", "max":"Math.max", "min":"Math.min",};

			for (var vale in array) { val = val.split(vale).join(array[vale]); break; }

			try {
				eval(val);
			} catch (e) {
				if (e instanceof SyntaxError) {
					this.v = true;
					$('#Function').attr('style', 'border:1px solid red;');
				}
			}

			if (this.v == false) {
				$('#loading').show();
				setTimeout(function() {
					var graph = new Graph();
						graph.graph = val;
						graph.color = __GRAPH_CUR_COLOR;

					__GRAPHS.push(graph);

					$('#add_graph_form').fadeOut();
					val;
					__GRAPH_CUR_COLOR = 0;
					$('#Function').attr('style', '');
					update();
					updateMenu();
				}, 20);
			}
		} else $('#Function').attr('style', 'border:1px solid red;');
	});

	$(document).on("click", ".add_graph", function(event) {
		$('#add').show();
		$('#edit').hide();
		$('#add_graph_form').fadeIn();
		__GRAPH_CUR_COLOR = 0;
		$('.color').attr('style', 'background:' + __GRAPH_COLORS[__GRAPH_CUR_COLOR] + '');
	});

	$(document).on("click", ".graph_edit", function() {
		var id = $(this).closest('.graph').find('.graph_id').html();
		$('#add').hide();
		$('#edit').show();
		$('#Function_edit').val(__GRAPHS[id].graph);
		__GRAPH_CUR_COLOR = __GRAPHS[id].color;
		$('.color_edit').attr('style', 'background:' + __GRAPH_COLORS[__GRAPH_CUR_COLOR] + '');
		$('#add_graph_form').fadeIn();
		$('.little_form .graph_id').html('' + id);
	});

	$(document).on("click", ".graph_delete", function(event) {
		__GRAPHS.splice($(this).closest('.graph').find('.graph_id').html(), 1);
		update();
		updateMenu();
	});

	$('.function_submit_edit').click(function() {
		var id = $(this).closest('#edit').find('.graph_id').html();

		if ($('#Function_edit').val() != '') {
			this.v = false;

			try {
				eval($('#Function_edit').val());
			} catch (e) {
				if (e instanceof SyntaxError) {
					this.v = true;
					$('#Function_edit').attr('style', 'border:1px solid red;');
				}
			}

			if (this.v == false) {
				$('#loading').show();
				setTimeout(function() {
					__GRAPHS[id].graph = $('#Function_edit').val();
					__GRAPHS[id].color = __GRAPH_CUR_COLOR;
					$('#add_graph_form').fadeOut();
					$('#Function').val('');
					__GRAPH_CUR_COLOR = 0;
					$('#Function').attr('style', '');
					update();
					updateMenu();
				}, 20);
			}
		} else $('#Function').attr('style', 'border:1px solid red;');
	});
});

