/*
 * http://jariz.github.io/vibrant.js/
 */

(function e$$0(x, y, p) {
	function h(m, b) {
		if (!y[m]) {
			if (!x[m]) {
				var a = "function" == typeof require && require;
				if (!b && a)
					return a(m, !0);
				if (e)
					return e(m, !0);
				a = Error("Cannot find module '" + m + "'");
				throw a.code = "MODULE_NOT_FOUND",
					a;
			}
			a = y[m] = {
				exports: {}
			};
			x[m][0].call(a.exports, function(a) {
				var b = x[m][1][a];
				return h(b ? b : a)
			}, a, a.exports, e$$0, x, y, p)
		}
		return y[m].exports
	}
	for (var e = "function" == typeof require && require, w = 0; w < p.length; w++)
		h(p[w]);
	return h
})({
	1: [function(z, x, y) {
		if (!p)
			var p = {
				map: function(h, e) {
					var p = {};
					return e ?
						h.map(function(h, b) {
							p.index = b;
							return e.call(p, h)
						}) : h.slice()
				},
				naturalOrder: function(h, e) {
					return h < e ? -1 : h > e ? 1 : 0
				},
				sum: function(h, e) {
					var p = {};
					return h.reduce(e ? function(h, b, a) {
						p.index = a;
						return h + e.call(p, b)
					} : function(h, b) {
						return h + b
					}, 0)
				},
				max: function(h, e) {
					return Math.max.apply(null, e ? p.map(h, e) : h)
				}
			};
		z = function() {
				function h(f, c, a) {
					return (f << 2 * d) + (c << d) + a
				}

				function e(f) {
					function c() {
						a.sort(f);
						b = !0
					}
					var a = [],
						b = !1;
					return {
						push: function(c) {
							a.push(c);
							b = !1
						},
						peek: function(f) {
							b || c();
							void 0 === f && (f = a.length - 1);
							return a[f]
						},
						pop: function() {
							b || c();
							return a.pop()
						},
						size: function() {
							return a.length
						},
						map: function(c) {
							return a.map(c)
						},
						debug: function() {
							b || c();
							return a
						}
					}
				}

				function w(f, c, a, b, g, d, s) {
					this.r1 = f;
					this.r2 = c;
					this.g1 = a;
					this.g2 = b;
					this.b1 = g;
					this.b2 = d;
					this.histo = s
				}

				function m() {
					this.vboxes = new e(function(f, c) {
						return p.naturalOrder(f.vbox.count() * f.vbox.volume(), c.vbox.count() * c.vbox.volume())
					})
				}

				function b(f) {
					var c = Array(1 << 3 * d),
						a, b, g, n;
					f.forEach(function(f) {
						b = f[0] >> k;
						g = f[1] >> k;
						n = f[2] >> k;
						a = h(b, g, n);
						c[a] = (c[a] || 0) + 1
					});
					return c
				}

				function a(f, c) {
					var a = 1E6,
						b = 0,
						g = 1E6,
						d = 0,
						n = 1E6,
						r = 0,
						q, l, h;
					f.forEach(function(c) {
						q = c[0] >> k;
						l = c[1] >> k;
						h = c[2] >> k;
						q < a ? a = q : q > b && (b = q);
						l < g ? g = l : l > d && (d = l);
						h < n ? n = h : h > r && (r = h)
					});
					return new w(a, b, g, d, n, r, c)
				}

				function n(a, c) {
					function b(a) {
						var f = a + "1";
						a += "2";
						var g, d, n, A;
						d = 0;
						for (l = c[f]; l <= c[a]; l++)
							if (r[l] > k / 2) {
								n = c.copy();
								A = c.copy();
								g = l - c[f];
								d = c[a] - l;
								for (g = g <= d ? Math.min(c[a] - 1, ~~(l + d / 2)) : Math.max(c[f], ~~(l - 1 - g / 2)); !r[g];)
									g++;
								for (d = q[g]; !d && r[g - 1];)
									d = q[--g];
								n[a] = g;
								A[f] = n[a] + 1;
								return [n, A]
							}
					}
					if (c.count()) {
						var d = c.r2 -
							c.r1 + 1,
							g = c.g2 - c.g1 + 1,
							n = p.max([d, g, c.b2 - c.b1 + 1]);
						if (1 == c.count())
							return [c.copy()];
						var k = 0,
							r = [],
							q = [],
							l, e, t, u, m;
						if (n == d)
							for (l = c.r1; l <= c.r2; l++) {
								u = 0;
								for (e = c.g1; e <= c.g2; e++)
									for (t = c.b1; t <= c.b2; t++)
										m = h(l, e, t),
										u += a[m] || 0;
								k += u;
								r[l] = k
							}
						else if (n == g)
							for (l = c.g1; l <= c.g2; l++) {
								u = 0;
								for (e = c.r1; e <= c.r2; e++)
									for (t = c.b1; t <= c.b2; t++)
										m = h(e, l, t),
										u += a[m] || 0;
								k += u;
								r[l] = k
							}
						else
							for (l = c.b1; l <= c.b2; l++) {
								u = 0;
								for (e = c.r1; e <= c.r2; e++)
									for (t = c.g1; t <= c.g2; t++)
										m = h(e, t, l),
										u += a[m] || 0;
								k += u;
								r[l] = k
							}
						r.forEach(function(a, c) {
							q[c] = k - a
						});
						return n ==
							d ? b("r") : n == g ? b("g") : b("b")
					}
				}
				var d = 5,
					k = 8 - d;
				w.prototype = {
					volume: function(a) {
						if (!this._volume || a)
							this._volume = (this.r2 - this.r1 + 1) * (this.g2 - this.g1 + 1) * (this.b2 - this.b1 + 1);
						return this._volume
					},
					count: function(a) {
						var c = this.histo;
						if (!this._count_set || a) {
							a = 0;
							var b, d, g;
							for (b = this.r1; b <= this.r2; b++)
								for (d = this.g1; d <= this.g2; d++)
									for (g = this.b1; g <= this.b2; g++)
										index = h(b, d, g),
										a += c[index] || 0;
							this._count = a;
							this._count_set = !0
						}
						return this._count
					},
					copy: function() {
						return new w(this.r1, this.r2, this.g1, this.g2, this.b1,
							this.b2, this.histo)
					},
					avg: function(a) {
						var c = this.histo;
						if (!this._avg || a) {
							a = 0;
							var b = 1 << 8 - d,
								n = 0,
								g = 0,
								k = 0,
								e, r, q, l;
							for (r = this.r1; r <= this.r2; r++)
								for (q = this.g1; q <= this.g2; q++)
									for (l = this.b1; l <= this.b2; l++)
										e = h(r, q, l),
										e = c[e] || 0,
										a += e,
										n += e * (r + 0.5) * b,
										g += e * (q + 0.5) * b,
										k += e * (l + 0.5) * b;
							this._avg = a ? [~~(n / a), ~~(g / a), ~~(k / a)] : [~~(b * (this.r1 + this.r2 + 1) / 2), ~~(b * (this.g1 + this.g2 + 1) / 2), ~~(b * (this.b1 + this.b2 + 1) / 2)]
						}
						return this._avg
					},
					contains: function(a) {
						var c = a[0] >> k;
						gval = a[1] >> k;
						bval = a[2] >> k;
						return c >= this.r1 && c <= this.r2 &&
							gval >= this.g1 && gval <= this.g2 && bval >= this.b1 && bval <= this.b2
					}
				};
				m.prototype = {
					push: function(a) {
						this.vboxes.push({
							vbox: a,
							color: a.avg()
						})
					},
					palette: function() {
						return this.vboxes.map(function(a) {
							return a.color
						})
					},
					size: function() {
						return this.vboxes.size()
					},
					map: function(a) {
						for (var c = this.vboxes, b = 0; b < c.size(); b++)
							if (c.peek(b).vbox.contains(a))
								return c.peek(b).color;
						return this.nearest(a)
					},
					nearest: function(a) {
						for (var c = this.vboxes, b, d, g, n = 0; n < c.size(); n++)
							if (d = Math.sqrt(Math.pow(a[0] - c.peek(n).color[0], 2) + Math.pow(a[1] -
									c.peek(n).color[1], 2) + Math.pow(a[2] - c.peek(n).color[2], 2)),
								d < b || void 0 === b)
								b = d,
								g = c.peek(n).color;
						return g
					},
					forcebw: function() {
						var a = this.vboxes;
						a.sort(function(a, b) {
							return p.naturalOrder(p.sum(a.color), p.sum(b.color))
						});
						var b = a[0].color;
						5 > b[0] && 5 > b[1] && 5 > b[2] && (a[0].color = [0, 0, 0]);
						var b = a.length - 1,
							d = a[b].color;
						251 < d[0] && 251 < d[1] && 251 < d[2] && (a[b].color = [255, 255, 255])
					}
				};
				return {
					quantize: function(d, c) {
						function k(a, b) {
							for (var c = 1, d = 0, g; 1E3 > d;)
								if (g = a.pop(),
									g.count()) {
									var f = n(h, g);
									g = f[0];
									f = f[1];
									if (!g)
										break;
									a.push(g);
									f && (a.push(f),
										c++);
									if (c >= b)
										break;
									if (1E3 < d++)
										break
								} else
									a.push(g),
									d++
						}
						if (!d.length || 2 > c || 256 < c)
							return !1;
						var h = b(d),
							g = 0;
						h.forEach(function() {
							g++
						});
						var v = a(d, h),
							s = new e(function(a, b) {
								return p.naturalOrder(a.count(), b.count())
							});
						s.push(v);
						k(s, 0.75 * c);
						for (v = new e(function(a, b) {
								return p.naturalOrder(a.count() * a.volume(), b.count() * b.volume())
							}); s.size();)
							v.push(s.pop());
						k(v, c - v.size());
						for (s = new m; v.size();)
							s.push(v.pop());
						return s
					}
				}
			}
			();
		x.exports = z.quantize
	}, {}],
	2: [function(z, x, y) {
		(function() {
			var p,
				h, e, w = function(b, a) {
					return function() {
						return b.apply(a, arguments)
					}
				},
				m = [].slice;
			window.Swatch = h = function() {
					function b(a, b) {
						this.rgb = a;
						this.population = b
					}
					b.prototype.hsl = void 0;
					b.prototype.rgb = void 0;
					b.prototype.population = 1;
					b.yiq = 0;
					b.prototype.getHsl = function() {
						return this.hsl ? this.hsl : this.hsl = e.rgbToHsl(this.rgb[0], this.rgb[1], this.rgb[2])
					};
					b.prototype.getPopulation = function() {
						return this.population
					};
					b.prototype.getRgb = function() {
						return this.rgb
					};
					b.prototype.getHex = function() {
						return "#" + (16777216 +
							(this.rgb[0] << 16) + (this.rgb[1] << 8) + this.rgb[2]).toString(16).slice(1, 7)
					};
					b.prototype.getTitleTextColor = function() {
						this._ensureTextColors();
						return 200 > this.yiq ? "#fff" : "#000"
					};
					b.prototype.getBodyTextColor = function() {
						this._ensureTextColors();
						return 150 > this.yiq ? "#fff" : "#000"
					};
					b.prototype._ensureTextColors = function() {
						if (!this.yiq)
							return this.yiq = (299 * this.rgb[0] + 587 * this.rgb[1] + 114 * this.rgb[2]) / 1E3
					};
					return b
				}
				();
			window.Vibrant = e = function() {
					function b(a, b, d) {
						this.swatches = w(this.swatches, this);
						var k, f,
							c, e, m, g, v, s, r, q, l;
						"undefined" === typeof b && (b = 64);
						"undefined" === typeof d && (d = 5);
						a = new p(a);
						try {
							v = a.getImageData();
							q = v.data;
							r = a.getPixelCount();
							f = [];
							for (g = 0; g < r;)
								s = 4 * g,
								l = q[s + 0],
								m = q[s + 1],
								c = q[s + 2],
								k = q[s + 3],
								125 <= k && (250 < l && 250 < m && 250 < c || f.push([l, m, c])),
								g += d;
							e = this.quantize(f, b);
							this._swatches = e.vboxes.map(function(a) {
									return function(a) {
										return new h(a.color, a.vbox.count())
									}
								}
								(this));
							this.maxPopulation = this.findMaxPopulation;
							this.generateVarationColors();
							this.generateEmptySwatches()
						} finally {
							a.removeCanvas()
						}
					}
					b.prototype.quantize = z("quantize");
					b.prototype._swatches = [];
					b.prototype.TARGET_DARK_LUMA = 0.26;
					b.prototype.MAX_DARK_LUMA = 0.45;
					b.prototype.MIN_LIGHT_LUMA = 0.55;
					b.prototype.TARGET_LIGHT_LUMA = 0.74;
					b.prototype.MIN_NORMAL_LUMA = 0.3;
					b.prototype.TARGET_NORMAL_LUMA = 0.5;
					b.prototype.MAX_NORMAL_LUMA = 0.7;
					b.prototype.TARGET_MUTED_SATURATION = 0.3;
					b.prototype.MAX_MUTED_SATURATION = 0.4;
					b.prototype.TARGET_VIBRANT_SATURATION = 1;
					b.prototype.MIN_VIBRANT_SATURATION = 0.35;
					b.prototype.WEIGHT_SATURATION = 3;
					b.prototype.WEIGHT_LUMA =
						6;
					b.prototype.WEIGHT_POPULATION = 1;
					b.prototype.VibrantSwatch = void 0;
					b.prototype.MutedSwatch = void 0;
					b.prototype.DarkVibrantSwatch = void 0;
					b.prototype.DarkMutedSwatch = void 0;
					b.prototype.LightVibrantSwatch = void 0;
					b.prototype.LightMutedSwatch = void 0;
					b.prototype.HighestPopulation = 0;
					b.prototype.generateVarationColors = function() {
						this.VibrantSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
						this.LightVibrantSwatch =
							this.findColorVariation(this.TARGET_LIGHT_LUMA, this.MIN_LIGHT_LUMA, 1, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
						this.DarkVibrantSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_VIBRANT_SATURATION, this.MIN_VIBRANT_SATURATION, 1);
						this.MutedSwatch = this.findColorVariation(this.TARGET_NORMAL_LUMA, this.MIN_NORMAL_LUMA, this.MAX_NORMAL_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
						this.LightMutedSwatch = this.findColorVariation(this.TARGET_LIGHT_LUMA,
							this.MIN_LIGHT_LUMA, 1, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION);
						return this.DarkMutedSwatch = this.findColorVariation(this.TARGET_DARK_LUMA, 0, this.MAX_DARK_LUMA, this.TARGET_MUTED_SATURATION, 0, this.MAX_MUTED_SATURATION)
					};
					b.prototype.generateEmptySwatches = function() {
						var a;
						void 0 === this.VibrantSwatch && void 0 !== this.DarkVibrantSwatch && (a = this.DarkVibrantSwatch.getHsl(),
							a[2] = this.TARGET_NORMAL_LUMA,
							this.VibrantSwatch = new h(b.hslToRgb(a[0], a[1], a[2]), 0));
						if (void 0 === this.DarkVibrantSwatch &&
							void 0 !== this.VibrantSwatch)
							return a = this.VibrantSwatch.getHsl(),
								a[2] = this.TARGET_DARK_LUMA,
								this.DarkVibrantSwatch = new h(b.hslToRgb(a[0], a[1], a[2]), 0)
					};
					b.prototype.findMaxPopulation = function() {
						var a, b, d, k, f;
						d = 0;
						k = this._swatches;
						a = 0;
						for (b = k.length; a < b; a++)
							f = k[a],
							d = Math.max(d, f.getPopulation());
						return d
					};
					b.prototype.findColorVariation = function(a, b, d, k, f, c) {
						var e, h, g, m, p, r, q, l;
						m = void 0;
						p = 0;
						r = this._swatches;
						e = 0;
						for (h = r.length; e < h; e++)
							if (l = r[e],
								q = l.getHsl()[1],
								g = l.getHsl()[2],
								q >= f && q <= c && g >= b && g <= d && !this.isAlreadySelected(l) &&
								(g = this.createComparisonValue(q, k, g, a, l.getPopulation(), this.HighestPopulation),
									void 0 === m || g > p))
								m = l,
								p = g;
						return m
					};
					b.prototype.createComparisonValue = function(a, b, d, k, f, c) {
						return this.weightedMean(this.invertDiff(a, b), this.WEIGHT_SATURATION, this.invertDiff(d, k), this.WEIGHT_LUMA, f / c, this.WEIGHT_POPULATION)
					};
					b.prototype.invertDiff = function(a, b) {
						return 1 - Math.abs(a - b)
					};
					b.prototype.weightedMean = function() {
						var a, b, d, k, f, c;
						f = 1 <= arguments.length ? m.call(arguments, 0) : [];
						for (a = d = b = 0; a < f.length;)
							k = f[a],
							c = f[a +
								1],
							b += k * c,
							d += c,
							a += 2;
						return b / d
					};
					b.prototype.swatches = function() {
						return {
							Vibrant: this.VibrantSwatch,
							Muted: this.MutedSwatch,
							DarkVibrant: this.DarkVibrantSwatch,
							DarkMuted: this.DarkMutedSwatch,
							LightVibrant: this.LightVibrantSwatch,
							LightMuted: this.LightMuted
						}
					};
					b.prototype.isAlreadySelected = function(a) {
						return this.VibrantSwatch === a || this.DarkVibrantSwatch === a || this.LightVibrantSwatch === a || this.MutedSwatch === a || this.DarkMutedSwatch === a || this.LightMutedSwatch === a
					};
					b.rgbToHsl = function(a, b, d) {
						var k, f, c, e, h;
						a /=
							255;
						b /= 255;
						d /= 255;
						e = Math.max(a, b, d);
						h = Math.min(a, b, d);
						f = void 0;
						c = (e + h) / 2;
						if (e === h)
							f = h = 0;
						else {
							k = e - h;
							h = 0.5 < c ? k / (2 - e - h) : k / (e + h);
							switch (e) {
								case a:
									f = (b - d) / k + (b < d ? 6 : 0);
									break;
								case b:
									f = (d - a) / k + 2;
									break;
								case d:
									f = (a - b) / k + 4
							}
							f /= 6
						}
						return [f, h, c]
					};
					b.hslToRgb = function(a, b, d) {
						var e, f, c;
						e = f = c = void 0;
						e = function(a, b, c) {
							0 > c && (c += 1);
							1 < c && (c -= 1);
							return c < 1 / 6 ? a + 6 * (b - a) * c : 0.5 > c ? b : c < 2 / 3 ? a + (b - a) * (2 / 3 - c) * 6 : a
						};
						0 === b ? c = f = e = d : (b = 0.5 > d ? d * (1 + b) : d + b - d * b,
							d = 2 * d - b,
							c = e(d, b, a + 1 / 3),
							f = e(d, b, a),
							e = e(d, b, a - 1 / 3));
						return [255 * c, 255 * f, 255 * e]
					};
					return b
				}
				();
			window.CanvasImage = p = function() {
					function b(a) {
						this.canvas = document.createElement("canvas");
						this.context = this.canvas.getContext("2d");
						document.body.appendChild(this.canvas);
						this.width = this.canvas.width = a.width;
						this.height = this.canvas.height = a.height;
						this.context.drawImage(a, 0, 0, this.width, this.height)
					}
					b.prototype.clear = function() {
						return this.context.clearRect(0, 0, this.width, this.height)
					};
					b.prototype.update = function(a) {
						return this.context.putImageData(a, 0, 0)
					};
					b.prototype.getPixelCount = function() {
						return this.width *
							this.height
					};
					b.prototype.getImageData = function() {
						return this.context.getImageData(0, 0, this.width, this.height)
					};
					b.prototype.removeCanvas = function() {
						return this.canvas.parentNode.removeChild(this.canvas)
					};
					return b
				}
				()
		}).call(this)
	}, {
		quantize: 1
	}]
}, {}, [2]);