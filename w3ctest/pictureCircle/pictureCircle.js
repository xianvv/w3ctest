/*
 * pictureCircle 图片环控件
 * by shichaoqian
 * 依赖jQuery。
 * 原理：通过transform实现3d效果，监听图片容器父元素的滑动事件，设置容器的转动角度。
 * 使用说明：
 * 1.创建：window.pictureCircle.create（页面初始化时调用）
 * 2.设置转动方式：window.pictureCircle.setRollType（一直以一个方式转，直到调用window.pictureCircle.stop）
 * 3.移除转动方式设置：window.pictureCircle.removeRollType（移除之后恢复默认效果）
 * 4.转动停止:window.pictureCircle.stop
 */
(function ($) {
    window.pictureCircle = {};
    /*图片宽度*/
    var width = 140;
    /*图片间隔*/
    var pad = 70;
    /*一弧度*/
    var rad = 2 * Math.PI / 360;
    /*滑动时的初始位置x*/
    var startX = 0;
    /*滑动时的初始位置y*/
    var startY = 0;
    /*pictureContainer上下偏移幅度*/
    var x = -15;
    /*pictureContainer左右偏移幅度*/
    var y = 0;
    /*加速度计时器*/
    var timer;
    /*纵向速度*/
    var speedX = 0;
    /*横向速度*/
    var speedY = 0;
    /*当前是否是windows系统*/
    var isWindow;
    var isWindowChecked = false;
    var actions;
    var config = {
        "paras": {}, //selector:paras
        "pictureContainer": {} //selector:pictureContainer
    };

    var _rollType = {
        free: "free", //360度自由转
        horizon: "horizon", //水平转
        vertical: "vertical" //垂直转
    };

    /*
	 * 生成图片环
	 * @param selector 元素的选择器，建议用div元素的。
	 * @param paras 参数们
	 *               示例：{imgs: [{src:src1,title:title1},{src:src2,title:title2}],          //图片列表
	 *                       defaultX:-15,               //默认竖直方向偏移
	 *                       speed:0.93,                 //滑动结束后的速度衰减系数(范围：0-1)
	 *                       lockX:false                 //竖直方向锁定
	 *                       }
	 * @example
	 *       pictureCircle.create("#pcTestDiv", { imgs: [{src:'http://pic.com/1.jpg',title:'第一张'},{src:'http://pic.com/2.jpg', title: '第二张'}] });
	 */
    window.pictureCircle.create = function (selector, paras) {
        var p = $(selector);
        if (p.length == 0 || !paras || !paras.imgs || paras.imgs.length == 0) {
            return;
        }
        config["paras"][selector] = paras;
        p[0].classList.add("pictureContainerParent");
        var div = document.createElement("div");
        p.html(div);
        p = $(div);
        p[0].classList.add("pictureContainer");
        config["pictureContainer"][selector] = p;

        setRotate(p, x, y, paras);
        if (!actions || actions.length == 0) {
            actions = getActions();
        }
        var iswin = isWindowBrowser();

        p.parent().on(actions[0], function (e) {
            event.preventDefault();
            clearInterval(timer);
            if (iswin) {
                startX = e.clientX;
                startY = e.clientY;
            } else {
                startX = event.touches[0].clientX;
                startY = event.touches[0].clientY;
            }

            p.parent().on(actions[1], function (ev) {
                var currentX;
                var currentY;
                if (iswin) {
                    currentX = ev.clientX;
                    currentY = ev.clientY;
                } else {
                    currentX = event.touches[0].clientX;
                    currentY = event.touches[0].clientY;
                }
                speedX = currentX - startX;
                speedY = currentY - startY;
                startX = currentX;
                startY = currentY;
                y += speedX * 0.5;
                x -= speedY * 0.5;
                setRotate(p, x, y, paras);
            });

            p.parent().on(actions[2], function () {
                p.parent().off(actions[1]);
                p.parent().off(actions[2]);
                var rollType = p.attr("rollType");
                if (rollType) {
                    startRoll(p, paras, rollType);
                } else {
                    startMove(p, paras);
                }
            });
        });

        var count = paras.imgs.length;
        var angle = 360 / count;
        var startAngle = 0 - angle;
        var r = (width + pad) / 2 / Math.tan(angle * rad / 2);
        if (r < 60) {
            r = 60;
        }
        var angles = [];
        for (var i = 0; i < count; i++) {
            var src = paras.imgs[i].src;
            var title = paras.imgs[i].title ? paras.imgs[i].title : "";
            startAngle += angle;
            angles.push(startAngle);
            var picDiv = getPictureDiv(src, startAngle, r, $(p).width(), $(p).height(), paras);
            if (title) {
                var titleSpan = document.createElement("span");
                titleSpan.classList.add("titleSpan");
                titleSpan.innerHTML = title;
                picDiv.appendChild(titleSpan);
            }
            p.append(picDiv);
        }
        var pics = p.children();
        displayPics(pics, angles, r, count - 1);
    };

    /*
	 * 设置转动方式
	 * @param selector 元素的选择器，建议用div元素的。
	 * @param rollType 参考_rollType
	 */
    window.pictureCircle.setRollType = function (selector, rollType) {
        var pictureContainer = config["pictureContainer"][selector];
        pictureContainer.attr("rollType", rollType);
    };

    window.pictureCircle.removeRollType = function (selector) {
        var pictureContainer = config["pictureContainer"][selector];
        pictureContainer.removeAttr("rollType");
    };

    window.pictureCircle.stop = function (selector) {
        var pictureContainer = config["pictureContainer"][selector];
        var paras = config["paras"][selector];
        startMove(pictureContainer, paras);
    };

    var displayPics = function (pics, angles, r, index) {
        if (index < 0) {
            return;
        }
        setTimeout(function () {
            $(pics[index]).css("-webkit-transform", "rotateY(" + angles[index] + "deg) translateZ(" + r + "px)");
            if (--index >= 0) {
                displayPics(pics, angles, r, index);
            }
        }, 300);
    };

    var isWindowBrowser = function () {
        if (isWindowChecked) {
            return isWindow;
        }
        isWindow = navigator.userAgent.toLowerCase().indexOf('windows') > -1;
        isWindowChecked = true;
        return isWindow;
    };

    var getActions = function () {
        if (isWindowBrowser()) {
            return ["mousedown", "mousemove", "mouseup"];
        }
        return ["touchstart", "touchmove", "touchend"];
    };

    /*
	 * 滑动结束后的惯性运动
	 */
    var startMove = function (pictureContainer, paras) {
        var speed = paras.speed;
        if (typeof speed != "number" || speed < 0 || speed >= 1) {
            speed = 0.93;
        }
        move(pictureContainer, paras, speed);
    };

    var startRoll = function (pictureContainer, paras, rollType) {
        switch (rollType) {
            case _rollType.horizon:
                x = 0;
                speedY = 0;
                break;
            case _rollType.vertical:
                y = 0;
                speedX = 0;
                break;
            default:
        }
        move(pictureContainer, paras, 1);
    };

    var move = function (pictureContainer, paras, speed) {
        clearInterval(timer);
        timer = setInterval(function () {
            x -= speedY;
            y += speedX;

            speedY *= speed;
            speedX *= speed;

            if (Math.abs(speedX) < 0.1 && Math.abs(speedY) < 0.1) {
                clearInterval(timer);
                if (pictureContainer.attr("rollType") == "horizon") {
                    toFocus(pictureContainer, paras);
                }
            }

            setRotate(pictureContainer, x, y, paras);
        }, 30);
    };

    /*
	 * 生成单个图片div
	 * @param src 图片资源
	 * @param angle 图片的横向偏移角度
	 * @param r 图片环的半径（图片中心距离pictureContainer中心的距离）
	 * @param parentWidth pictureContainer的宽度
	 */
    var getPictureDiv = function (src, angle, r, parentWidth, parentHeight, paras) {
        var child = document.createElement("div");
        child.classList.add("pictureElement");
        //$(child).css("-webkit-transform", "rotateY(" + angle + "deg) translateZ(" + r + "px)");
        child.setAttribute("rotatey", angle);
        child.style.backgroundImage = "url(" + src + ")";
        child.style.width = width + "px";
        var height = width * 1.4;
        child.style.height = height + "px";
        child.style.left = parentWidth / 2 - width / 2 + "px";
        child.style.bottom = parentHeight / 2 - height / 2 + "px";
        child.onclick = function (event) {
            focusElement(event.target, paras);
        };
        $(child).on("tap", function (event) {
            focusElement(event.target, paras);
        });
        return child;
    };

    /*
	 * 设置element的偏移幅度
	 */
    var setRotate = function (element, rotatex, rotatey, paras) {
        if (paras.lockX) {
            if (typeof paras.defaultX == "number") {
                rotatex = paras.defaultX;
            } else {
                rotatex = -15;
            }
        }
        element.css("-webkit-transform", "perspective(1000px) rotateX(" + rotatex + "deg) rotateY(" + rotatey + "deg)");
    };

    /*
	 * 点击某张图片时将其定位到屏幕中间
	 */
    var focusElement = function (target, paras) {
        var correct = function (el) {
            return el.tagName == "DIV" && el.classList.contains("pictureElement");
        };
        var terminal = function (el) {
            return el.tagName == "DIV" && el.classList.contains("pictureContainer");
        };
        var picDiv = findElement(target, correct, terminal);

        var targetRotatey = picDiv.getAttribute("rotatey");
        x = 0;
        y = 0 - targetRotatey;
        setRotate($(picDiv.parentElement), x, y, paras);
    };

    /*
	 * 在当前元素及其父元素中找到符合correct条件的那个元素
	 * @param element 当前元素
	 * @param correct 正确的条件，符合时返回element
	 * @param terminal 终止条件，符合时返回null
	 */
    var findElement = function (element, correct, terminal) {
        if (terminal && terminal(element)) {
            return null;
        }
        if (correct && correct(element)) {
            return element;
        }
        return findElement(element.parentElement, correct, terminal);
    };

    var toFocus = function (pictureContainer, paras) {
        var pTransform = pictureContainer[0].style.transform;
        var rotateY = parseInt(pTransform.split("rotateY")[1].split("(")[1].split("deg")[0]) % 360;
        if (rotateY < 0) {
            rotateY += 360;
        }
        var picDivs = pictureContainer.children();
        var correctRad = 180 / picDivs.length;
        for (var i = 0; i < picDivs.length; i++) {
            var p = picDivs[i];
            var pRotateY = 360 - p.getAttribute("rotatey");
            if (Math.abs(rotateY - pRotateY) < correctRad) {
                focusElement(p, paras);
                return;
            }
        }
    };
})(jQuery);