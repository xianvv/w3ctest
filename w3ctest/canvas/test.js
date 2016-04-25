(function($) {
	var hastouch = "ontouchstart" in window ? true : false,
		tapstart = hastouch ? "touchstart" : "mousedown",
		tapmove = hastouch ? "touchmove" : "mousemove",
		tapend = hastouch ? "touchend" : "mouseup";

	function createElement(tag, option, parent, prepend) {
		var e = document.createElement(tag);
		if (option) {
			for (var key in option) {
				e.setAttribute(key, option[key]);
			}
		}
		if (parent) {
			if (prepend) {
				$(parent).prepend(e);
			} else {
				parent.appendChild(e);
			}
		}
		return e;
	}

	/*
	 * canvas类
	 * @param selector 容器选择器
	 * @param options 示例：
	 * 				{
	 * 					width:123,
	 * 					height:123
	 * 				}
	 */
	var canvasInstance = function(selector, options) {
		var sel = selector;
		var opt = options;
		var cv, ctx, self = this;

		this.create = function() {
			var maxWidth, maxHeight;
			var container = $(sel),
				maxWidth = opt.width,
				maxHeight = opt.height;
			if (!container || container.length == 0) {
				return false;
			}
			if (!maxWidth) {
				maxWidth = container.width();
			}
			if (!maxHeight) {
				maxHeight = container.height();
			}
			if (maxWidth == 0) {
				maxWidth = 300;
			}
			if (maxHeight == 0) {
				maxHeight = 300;
			}
			cv = createElement("canvas", {
				class: "gCanvas",
				width: maxWidth,
				height: maxHeight
			}, container[0]);
			ctx = cv.getContext("2d");
			return true;
		};

		/*
		 * 画矩形
		 * @param o 示例：
		 * 				{
		 * 					fillColor:"#000",
		 * 					strokeColor:"#ffb",
		 * 					startX:123,
		 * 					startY:232,
		 * 					width:232,
		 * 					height:232,
		 * 				}
		 */
		this.drawRect = function(o) {
			o = $.extend({}, o);
			setCommonAttr(o);
			var fill = stroke = false;

			if (o.fillColor) {
				fill = true;
			}
			if (o.strokeColor) {
				stroke = true;
			}
			var startx = starty = w = h = 0;
			if (o.startX && typeof o.startX == "number") {
				startx = o.startX;
			}
			if (o.startY && typeof o.startY == "number") {
				starty = o.startY;
			}
			if (o.width && typeof o.width == "number") {
				w = o.width;
			}
			if (o.height && typeof o.height == "number") {
				h = o.height;
			}
			if (fill) {
				ctx.fillRect(startx, starty, w, h);
			}
			if (stroke) {
				ctx.beginPath();
				ctx.strokeRect(startx, starty, w, h);
				ctx.closePath();
			}
		};

		/*
		 * 把点用线连起来
		 * @param o 示例
		 * 		{
		 *			lineWidth:1,
		 * 			color:"#bbb",
		 * 			points:[{x:1,y:2},{x:3,y:4}]
		 * 		}
		 */
		this.drawLine = function(o) {
			o = $.extend({}, o);
			setCommonAttr(o);
			if (!o || !o.points || o.points.length < 2) {
				return;
			}
			var x = y = 0,
				point = o.points[0];
			if (point.x && typeof point.x == "number") {
				x = point.x;
			}
			if (point.y && typeof point.y == "number") {
				y = point.y;
			}
			ctx.beginPath();
			ctx.moveTo(x, y);
			var x = y = 0;
			for (var i = 1; i < o.points.length; i++) {
				point = o.points[i];
				if (point.x && typeof point.x == "number") {
					x = point.x;
				}
				if (point.y && typeof point.y == "number") {
					y = point.y;
				}
				ctx.lineTo(x, y);
				var x = y = 0;
			}
			ctx.closePath();
			ctx.stroke();
			reverse();
		};

		this.drawCircle = function(o) {
			o = $.extend({}, o);
			setCommonAttr(o);
			var x = o.x,
				y = o.y,
				r = o.r,
				startAngle = o.startAngle,
				endAngle = o.endAngle,
				counterclockwise = o.counterclockwise;

			if (startAngle == undefined) {
				startAngle = 0;
			}
			if (endAngle == undefined) {
				endAngle = Math.PI * 2;
			}
			if (counterclockwise == undefined) {
				counterclockwise = true;
			}
			ctx.beginPath();
			ctx.arc(x, y, r, startAngle, endAngle, counterclockwise);
			ctx.closePath();
			if (o.fillColor) {
				ctx.fill();
			}
			if (o.strokeColor) {
				ctx.stroke();
			}
			reverse();
		};

		this.drawPic = function(o) {
			o = $.extend({}, o);
			var img = o.img;
			if (!img) {
				return;
			}
			setCommonAttr(o);
			ctx.drawImage(img, 0, 0, img.width, img.height);
			reverse();
		};

		this.enableDragPic = function(callback) {
			cv.addEventListener("dragover", function(e) {
				e.preventDefault();
			}, true);
			cv.addEventListener("drop", function(e) {
				e.preventDefault();
				loadPic(e.dataTransfer.files[0], callback);
			}, true);
		};

		this.toImgSrc = function() {
			return cv.toDataURL("image/jpg");
		};

		this.beginCustom = function(t, o) {
			var $cv = $(cv).off();
			switch (t) {
				case "point":
					customPoint($cv, o);
					break;
				case "line":
					customLine($cv, o);
					break;
				case "pointToLine":
					customPointToLine($cv, o);
					break;
				case "rect":
					customRect($cv, o);
					break;
				case "circle":
					customCircle($cv, o);
					break;
				case "free":
					customFree($cv, o);
					break;
				case "eraser":
					customEraser($cv, o);
					break;
			}
		};

		this.clear = function() {
			ctx.clearRect(0, 0, cv.width, cv.height);
		};

		this.setAttr = function(o) {
			setCommonAttr(o);
		};

		function loadPic(f, callback) {
			self.clear();
			var reader = new FileReader();
			reader.onload = function(e) {
				var img = createElement("img");
				img.onload = function() {
					var maxW = cv.width;
					if (img.width > maxW) {
						img.height *= maxW / img.width;
						img.width = cv.width;
					}
					self.drawPic({
						img: img
					});
					if (callback) {
						var vibrant = new Vibrant(img);
						var swatches = vibrant.swatches()
						for (var swatch in swatches) {
							if (swatches.hasOwnProperty(swatch) && swatches[swatch]) {
								callback(swatch, swatches[swatch].getHex())
							}
						}
					}
				};
				img.src = e.target.result;
			};
			reader.readAsDataURL(f);
		}

		function customPoint($cv, o) {
			var endx, endy, opt;
			$cv.on(tapend, function(e) {
				endx = e.offsetX;
				endy = e.offsetY;
				opt = $.extend({}, o, {
					x: endx,
					y: endy,
					r: 1
				});
				self.drawCircle(opt);
			});
		}

		function customLine($cv, o) {
			var startx, starty, endx, endy, opt, eventConfig = {};
			eventConfig[tapstart] = function(e) {
				startx = e.offsetX;
				starty = e.offsetY;
			};
			eventConfig[tapend] = function(e) {
				endx = e.offsetX;
				endy = e.offsetY;
				opt = $.extend({}, o, {
					points: [{
						x: startx,
						y: starty
					}, {
						x: endx,
						y: endy
					}]
				});
				self.drawLine(opt);
			};
			$cv.on(eventConfig);
		}

		function customPointToLine($cv, o) {
			var endx, endy, tmpx = tmpy = undefined,
				opt;
			$cv.on(tapend, function(e) {
				endx = e.offsetX;
				endy = e.offsetY;
				opt = $.extend({}, o, {
					x: endx,
					y: endy,
					r: 1
				});
				self.drawCircle(opt);
				if (tmpx) {
					opt = $.extend({}, o, {
						points: [{
							x: tmpx,
							y: tmpy
						}, {
							x: endx,
							y: endy
						}]
					});
					self.drawLine(opt);
				}
				tmpx = endx;
				tmpy = endy;
			});
		}

		function customRect($cv, o) {
			var startx, starty, endx, endy, opt, eventConfig = {};
			eventConfig[tapstart] = function(e) {
				startx = e.offsetX;
				starty = e.offsetY;
			};
			eventConfig[tapend] = function(e) {
				endx = e.offsetX;
				endy = e.offsetY;
				opt = $.extend({}, o, {
					startX: startx,
					startY: starty,
					width: endx - startx,
					height: endy - starty
				});
				self.drawRect(opt);
			};
			$cv.on(eventConfig);
		}

		function customCircle($cv, o) {
			var startx, starty, endx, endy, opt, eventConfig = {};
			eventConfig[tapstart] = function(e) {
				startx = e.offsetX;
				starty = e.offsetY;
			};
			eventConfig[tapend] = function(e) {
				endx = e.offsetX;
				endy = e.offsetY;
				var x = (startx + endx) / 2;
				var y = (starty + endy) / 2;
				var r = Math.sqrt(Math.pow(startx - endx, 2) + Math.pow(starty - endy, 2)) / 2;
				opt = $.extend({}, o, {
					x: x,
					y: y,
					r: r
				});
				self.drawCircle(opt);
			};
			$cv.on(eventConfig);
		}

		function customFree($cv, o) {
			var startx, starty, endx, endy, tmpx, tmpy, opt, eventConfig = {};
			$cv.on(tapstart, function(e) {
				startx = e.offsetX;
				starty = e.offsetY;
				tmpx = startx;
				tmpy = starty;
				eventConfig[tapmove] = function(e) {
					endx = e.offsetX;
					endy = e.offsetY;
					opt = $.extend({}, o, {
						points: [{
							x: tmpx,
							y: tmpy
						}, {
							x: endx,
							y: endy
						}]
					});
					self.drawLine(opt);

					tmpx = endx;
					tmpy = endy;
				};
				eventConfig[tapend] = function(e) {
					endx = e.offsetX;
					endy = e.offsetY;
					opt = $.extend({}, o, {
						points: [{
							x: tmpx,
							y: tmpy
						}, {
							x: endx,
							y: endy
						}]
					});
					self.drawLine(opt);
					$cv.off(tapmove);
					$cv.off(tapend);
				}
				$cv.on(eventConfig);
			});
		}

		function customEraser($cv, o) {
			var startx, starty, endx, endy, tmpx, tmpy, opt, eventConfig = {};
			var baseOpt = {
				globalCompositeOperation: "destination-out",
				lineCap: "round",
				lineJoin: "round"
			};
			$cv.on(tapstart, function(e) {
				startx = e.offsetX;
				starty = e.offsetY;
				tmpx = startx;
				tmpy = starty;
				eventConfig[tapmove] = function(e) {
					endx = e.offsetX;
					endy = e.offsetY;
					opt = $.extend(baseOpt, o, {
						points: [{
							x: tmpx,
							y: tmpy
						}, {
							x: endx,
							y: endy
						}]
					});
					self.drawLine(opt);

					tmpx = endx;
					tmpy = endy;
				};
				eventConfig[tapend] = function(e) {
					endx = e.offsetX;
					endy = e.offsetY;
					opt = $.extend(baseOpt, o, {
						points: [{
							x: tmpx,
							y: tmpy
						}, {
							x: endx,
							y: endy
						}]
					});
					self.drawLine(opt);
					$cv.off(tapmove);
					$cv.off(tapend);
				}
				$cv.on(eventConfig);
			});
		}

		function setCommonAttr(o) {
			if (o.lineWidth) {
				ctx.lineWidth = o.lineWidth;
			}
			if (o.fillColor) {
				ctx.fillStyle = o.fillColor;
			}
			if (o.strokeColor) {
				ctx.strokeStyle = o.strokeColor;
			}
			if (o.lineCap) {
				ctx.lineCap = o.lineCap;
			}
			if (o.lineJoin) {
				ctx.lineJoin = o.lineJoin;
			}
			if (o.shadowBlur) {
				ctx.shadowBlur = o.shadowBlur;
			}
			if (o.shadowColor) {
				ctx.shadowColor = o.shadowColor;
			}
			if (o.globalCompositeOperation) {
				ctx.globalCompositeOperation = o.globalCompositeOperation;
			}
		}

		function reverse() {
			ctx.lineWidth = 1;
			ctx.fillStyle = "#000000";
			ctx.strokeStyle = "#000000";
			ctx.lineCap = "butt";
			ctx.lineJoin = "bevel";
			ctx.shadowBlur = 0;
			ctx.shadowColor = "#000000";
			ctx.globalCompositeOperation = "source-over";
		}
	};

	window.canvas = {
		init: function(selector, options) {
			if (!options) {
				options = {};
			}
			var ci = new canvasInstance(selector, options);
			var inited = ci.create();
			if (inited) {
				return ci;
			}
			return null;
		}
	};

})(jQuery);