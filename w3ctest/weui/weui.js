/*
 * weui 控件
 * by shichaoqian
 * 依赖jQuery,微信weui样式库。
 */
(function ($) {
    window.weui = {};
    var wuCache = {
        confirm: null,
        alert: null,
        toast: null,
        loadingToast: null,
        msgPage: null,
        actionSheet: null
    };

    /*
    * 确认框
    */
    window.weui.confirm = function (title, content, callback) {
        if (!wuCache.confirm) {
            wuCache.confirm = new wuConfirm();
        }
        if (!title) {
            title = "确认";
        }
        if (!content) {
            content = "是否继续？";
        }
        wuCache.confirm.show({
            "title": title,
            "content": content,
            "callback": callback
        });
    };

    /*
    * 提示框
    */
    window.weui.alert = function (title, content, callback) {
        if (!wuCache.alert) {
            wuCache.alert = new wuAlert();
        }
        if (!title) {
            title = "提示";
        }
        if (!content) {
            content = "没有消息。";
        }
        wuCache.alert.show({
            "title": title,
            "content": content,
            "callback": callback
        });
    };

    /*
    * toast消息提示框
    */
    window.weui.toast = function (content, callback) {
        if (!wuCache.toast) {
            wuCache.toast = new wuToast();
        }
        if (!content) {
            content = "已完成";
        }
        wuCache.toast.show({
            "content": content,
            "callback": callback
        });
    };

    /*
    * 加载提示框
    * @param option show:显示，hide:隐藏
    */
    window.weui.loadingToast = function (option, content) {
        if (!wuCache.loadingToast) {
            wuCache.loadingToast = new wuLoadingToast();
        }
        if (!option) {
            option = "show";
        }
        if (!content) {
            content = "数据加载中";
        }
        switch (option) {
            case "show":
                wuCache.loadingToast.show({
                    "content": content
                });
                break;
            case "hide":
                wuCache.loadingToast.hide();
                break;
        }
    };

    /*
    * 提示页，目前不适合使用
    */
    window.weui.msgPage = function (title, content, callback) {
        if (!wuCache.msgPage) {
            wuCache.msgPage = new wuMsgPage();
        }
        if (!title) {
            title = "操作成功";
        }
        if (!content) {
            content = "内容详情";
        }
        wuCache.msgPage.show({
            "title": title,
            "content": content,
            "callback": callback
        });
    };

    /*
    * 弹出菜单
    * @param option init:初始化，show:显示
    * @param paras
    *           option为init时示例：[{code:"save",title:"保存",action:function(e){alert("success.");}},...]
    *           option为show时可以为空
    */
    window.weui.actionSheet = function (option, paras) {
        if (!wuCache.actionSheet) {
            wuCache.actionSheet = new wuActionSheet();
        }
        if (!paras) {
            paras = {};
        }
        switch (option) {
            case "init":
                wuCache.actionSheet.init(paras);
                break;
            case "show":
                wuCache.actionSheet.show(paras);
                break;
            default:
                break;
        }
    };

    var wuBase = (function () {
        function base() { }
        base.prototype.prepareAndDisplay = function () { };
        base.prototype.afterDisplay = function () { };
        base.prototype.show = function (paras) {
            this.prepareAndDisplay(paras);
            this.afterDisplay(paras);
        };
        return base;
    })();

    var wuConfirm = (function (base) {
        var thisObj, thisTitle, thisContent, cancelBtn, confirmBtn;

        function myConfirm() { }

        function getDiv(title, content) {
            var result = createElement("div", {
                "class": "weui_dialog_confirm"
            });
            createElement("div", {
                "class": "weui_mask"
            }, result);
            var divDiag = createElement("div", {
                "class": "weui_dialog"
            }, result);
            var titleDiv = createElement("div", {
                "class": "weui_dialog_hd"
            }, divDiag);
            var tStrong = createElement("strong", {
                "class": "weui_dialog_title"
            }, titleDiv);
            thisTitle = tStrong;
            tStrong.innerHTML = title;
            var div = createElement("div", {
                "class": "weui_dialog_bd"
            }, divDiag);
            thisContent = div;
            div.innerHTML = content;
            div = createElement("div", {
                "class": "weui_dialog_ft"
            }, divDiag);
            var a = createElement("a", {
                "class": "weui_btn_dialog default"
            }, div);
            a.innerHTML = "取消";
            cancelBtn = $(a);
            a = createElement("a", {
                "class": "weui_btn_dialog primary"
            }, div);
            a.innerHTML = "确定";
            confirmBtn = $(a);
            document.body.appendChild(result);
            return $(result);
        }

        myConfirm.prototype.prepareAndDisplay = function (paras) {
            if (!thisObj) {
                thisObj = getDiv(paras.title, paras.content);
            } else {
                thisTitle.innerHTML = paras.title;
                thisContent.innerHTML = paras.content;
                thisObj.show();
            }
            //为了兼容jquerymobile页面过渡事件
            $(document).off("pagebeforehide.weui").on("pagebeforehide.weui", function () {
                thisObj.hide();
            });
        };

        myConfirm.prototype.afterDisplay = function (paras) {
            cancelBtn.unbind("click.wu").bind("click.wu", function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback(false);
                }
            });
            confirmBtn.unbind("click.wu").bind("click.wu", function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback(true);
                }
            });
        };

        myConfirm.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        return myConfirm;
    })(wuBase);

    var wuAlert = (function (base) {
        var thisObj, thisTitle, thisContent, confirmBtn;

        function myAlert() { }

        function getDiv(title, content) {
            var result = createElement("div", {
                "class": "weui_dialog_alert"
            });
            createElement("div", {
                "class": "weui_mask"
            }, result);
            var divDiag = createElement("div", {
                "class": "weui_dialog"
            }, result);
            var titleDiv = createElement("div", {
                "class": "weui_dialog_hd"
            }, divDiag);
            var tStrong = createElement("strong", {
                "class": "weui_dialog_title"
            }, titleDiv);
            thisTitle = tStrong;
            tStrong.innerHTML = title;
            var div = createElement("div", {
                "class": "weui_dialog_bd"
            }, divDiag);
            thisContent = div;
            div.innerHTML = content;
            div = createElement("div", {
                "class": "weui_dialog_ft"
            }, divDiag);
            var a = createElement("a", {
                "class": "weui_btn_dialog primary"
            }, div);
            a.innerHTML = "确定";
            confirmBtn = $(a);
            document.body.appendChild(result);
            return $(result);
        }

        myAlert.prototype.prepareAndDisplay = function (paras) {
            if (!thisObj) {
                thisObj = getDiv(paras.title, paras.content);
            } else {
                thisTitle.innerHTML = paras.title;
                thisContent.innerHTML = paras.content;
                thisObj.show();
            }
            //为了兼容jquerymobile页面过渡事件
            $(document).off("pagebeforehide.weui").on("pagebeforehide.weui", function () {
                thisObj.hide();
            });
        };

        myAlert.prototype.afterDisplay = function (paras) {
            confirmBtn.unbind("click.wu").bind("click.wu", function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback();
                }
            });
        };

        myAlert.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        return myAlert;
    })(wuBase);

    var wuToast = (function (base) {
        var thisObj, thisContent;

        function toast() { }

        function getDiv(content) {
            var result = createElement("div");
            createElement("div", {
                "class": "weui_mask_transparent"
            }, result);
            var div = createElement("div", {
                "class": "weui_toast"
            }, result);
            createElement("i", {
                "class": "weui_icon_toast"
            }, div);
            thisContent = createElement("p", {
                "class": "weui_toast_content"
            }, div);
            thisContent.innerHTML = content;
            document.body.appendChild(result);
            return $(result);
        }

        toast.prototype.prepareAndDisplay = function (paras) {
            if (!thisObj) {
                thisObj = getDiv(paras.content);
            } else {
                thisContent.innerHTML = paras.content;
                thisObj.show();
            }
        };

        toast.prototype.afterDisplay = function (paras) {
            setTimeout(function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback();
                }
            }, 1000);
        };

        toast.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        return toast;
    })(wuBase);

    var wuLoadingToast = (function (base) {
        var thisObj, thisContent;

        function loadingToast() { }

        function getDiv(content) {
            var result = createElement("div", {
                "class": "weui_loading_toast"
            });
            createElement("div", {
                //"class": "weui_mask_transparent"
                "class": "weui_mask"
            }, result);
            var div = createElement("div", {
                "class": "weui_toast"
            }, result);
            var loadingDiv = createElement("div", {
                "class": "weui_loading"
            }, div);
            for (var i = 0; i < 12; i++) {
                createElement("div", {
                    "class": "weui_loading_leaf weui_loading_leaf_" + i
                }, loadingDiv);
            }
            thisContent = createElement("p", {
                "class": "weui_toast_content"
            }, div);
            thisContent.innerHTML = content;
            document.body.appendChild(result);
            return $(result);
        }

        loadingToast.prototype.prepareAndDisplay = function (paras) {
            if (!thisObj) {
                thisObj = getDiv(paras.content);
            } else {
                thisContent.innerHTML = paras.content;
                thisObj.show();
            }
            //为了兼容jquerymobile页面过渡事件
            $(document).off("pagebeforehide.weui").on("pagebeforehide.weui", function () {
                thisObj.hide();
            });
        };

        loadingToast.prototype.afterDisplay = function () {

        };

        loadingToast.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        loadingToast.prototype.hide = function () {
            thisObj.hide();
        };

        return loadingToast;
    })(wuBase);

    var wuMsgPage = (function (base) {
        var thisObj, thisTitle, thisContent, cancelBtn, confirmBtn, detailBtn;

        function msgPage() { }

        function getDiv(title, content) {
            var result = createElement("div", {
                "class": "weui_msg"
            });
            var div = createElement("div", {
                "class": "weui_icon_area"
            }, result);
            createElement("i", {
                "class": "weui_icon_success weui_icon_msg"
            }, div);
            div = createElement("div", {
                "class": "weui_text_area"
            }, result);
            thisTitle = createElement("h2", {
                "class": "weui_msg_title"
            }, div);
            thisTitle.innerHTML = title;
            thisContent = createElement("p", {
                "class": "weui_msg_desc"
            }, div);
            thisContent.innerHTML = content;
            div = createElement("div", {
                "class": "weui_opr_area"
            }, result);
            var p = createElement("p", {
                "class": "weui_btn_area"
            }, div);
            var a = createElement("a", {
                "class": "weui_btn weui_btn_primary"
            }, p);
            confirmBtn = $(a);
            a.innerHTML = "确定";
            a = createElement("a", {
                "class": "weui_btn weui_btn_default"
            }, p);
            cancelBtn = $(a);
            a.innerHTML = "取消";
            div = createElement("div", {
                "class": "weui_extra_area"
            }, result);
            detailBtn = createElement("a", null, div);
            detailBtn.innerHTML = "查看详情";
            document.body.appendChild(result);
            return $(result);
        }

        msgPage.prototype.prepareAndDisplay = function (paras) {
            if (!thisObj) {
                thisObj = getDiv(paras.title, paras.content);
            } else {
                thisTitle.innerHTML = paras.title;
                thisContent.innerHTML = paras.content;
                thisObj.show();
            }
            //为了兼容jquerymobile页面过渡事件
            $(document).off("pagebeforehide.weui").on("pagebeforehide.weui", function () {
                thisObj.hide();
            });
        };

        msgPage.prototype.afterDisplay = function (paras) {
            cancelBtn.unbind("click.wu").bind("click.wu", function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback(false);
                }
            });
            confirmBtn.unbind("click.wu").bind("click.wu", function () {
                thisObj.hide();
                if (paras.callback) {
                    paras.callback(true);
                }
            });
        };

        msgPage.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        return msgPage;
    })(wuBase);

    var wuActionSheet = (function (base) {
        var thisObj, thisItems, cancelBtn, maskDiv, actionSheetDiv, itemDivDic;

        function actionSheet() { }

        function getDiv() {
            itemDivDic = {};
            var result = createElement("div", {
                "class": "actionSheet_wrap"
            });
            $(result).css({ "display": "none" });
            var div = createElement("div", {
                "class": "weui_mask_transition"
            }, result);
            maskDiv = $(div);
            div = createElement("div", {
                "class": "weui_actionsheet"
            }, result);
            actionSheetDiv = $(div);
            var itemDiv = createElement("div", {
                "class": "weui_actionsheet_menu"
            }, div);
            if (thisItems && thisItems.length > 0) {
                for (var i = 0; i < thisItems.length; i++) {
                    var item = thisItems[i];
                    var tmpDiv = createElement("div", {
                        "class": "weui_actionsheet_cell"
                    }, itemDiv);
                    tmpDiv.innerHTML = item.title;
                    itemDivDic[i] = $(tmpDiv);
                }
            }
            var cancelDiv = createElement("div", {
                "class": "weui_actionsheet_action"
            }, div);
            cancelBtn = createElement("div", {
                "class": "weui_actionsheet_cell"
            }, cancelDiv);
            cancelBtn.innerHTML = "取消";
            cancelBtn = $(cancelBtn);
            document.body.appendChild(result);
            return $(result);
        }

        /*
		 * @param items 菜单项配置列表 [{code:"save",title:"保存",action:function(e){alert("success.");}}]
		 */
        actionSheet.prototype.init = function (items) {
            thisObj = null;
            thisItems = items;
        };

        actionSheet.prototype.prepareAndDisplay = function () {
            if (!thisObj) {
                thisObj = getDiv();

                if (thisItems && thisItems.length > 0) {
                    for (var i = 0; i < thisItems.length; i++) {
                        itemDivDic[i].unbind("click.wu").bind("click.wu", thisItems[i].action).bind("click.wu", function () { hideActionSheet(actionSheetDiv, maskDiv); });
                    }
                }
            }
            thisObj.show();
            //为了兼容jquerymobile页面过渡事件
            $(document).off("pagebeforehide.weui").on("pagebeforehide.weui", function () {
                thisObj.hide();
            });

            actionSheetDiv.addClass('weui_actionsheet_toggle');
            maskDiv.show().addClass('weui_fade_toggle').click(function () {
                hideActionSheet(actionSheetDiv, maskDiv);
            });
            cancelBtn.unbind("click.hide").bind("click.hide", function () {
                hideActionSheet(actionSheetDiv, maskDiv);
            });
            actionSheetDiv.unbind('transitionend').unbind('webkitTransitionEnd');

            function hideActionSheet(weuiActionsheet, mask) {
                weuiActionsheet.removeClass('weui_actionsheet_toggle');
                mask.removeClass('weui_fade_toggle');
                weuiActionsheet.on('transitionend', function () {
                    mask.hide();
                }).on('webkitTransitionEnd', function () {
                    mask.hide();
                });
            }
        };

        actionSheet.prototype.afterDisplay = function (paras) {
            cancelBtn.unbind("click.wu").bind("click.wu", function () {
                if (paras.cancelCallback) {
                    paras.cancelCallback();
                }
            });
        };

        actionSheet.prototype.show = function (paras) {
            base.prototype.show.call(this, paras);
        };

        return actionSheet;
    })(wuBase);

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
})(jQuery);