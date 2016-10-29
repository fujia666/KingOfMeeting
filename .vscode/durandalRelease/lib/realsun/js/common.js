var appfunctions = appfunctions || {};
var appConfig;
appfunctions.uploadFile = new function () {
    var uploadFile = this;
    this.swfFileUpload = function (aappConfig, fileupload) {
        fileupload.setUploadUrl(aappConfig.app.uploadFileUrl + "?savepath=e:\\web\\rispweb\\upfiles&httppath=" + aappConfig.app.httppath);
        fileupload.startUpload();
    };
    this.ajaxFileUpload = function (aappConfig, inputFile) {
        mini.parse();
        scriptLoaded();
        function scriptLoaded() {
            alert('scriptLoaded');
            $.ajaxFileUpload({
                url: aappConfig.app.uploadFileUrl,
                fileElementId: inputFile,
                data: { savepath: "e:\\web\\rispweb\\upfiles" },
                dataType: 'json',
                success: function (data, status) {
                    if (data) {
                        alert("上传成功: " + data);
                    }
                    else {
                        alert("上传成功,无返回信息 ");
                    }
                },
                error: function (data, status, e) {
                    alert(e);
                },
                complete: function () {
                    var jq = $("#file1 > input:file");
                    jq.before(inputFile);
                    jq.remove();
                }
            });
        }
    };
};
var dbHelper = (function () {
    function dbHelper(baseurl, user, ucode) {
        this.saveMethod = appConfig.app.saveMethod;
        this.getMethod = appConfig.app.getMethod;
        this.baseUrl = baseurl;
        this.user = user;
        this.ucode = ucode;
    }
     
    dbHelper.prototype.dbGetdata = function (resid, subresid, cmswhere, fnSuccess, fnError, fnSyserror,pageSize,pageIndex) {
        var url;
        url = this.baseUrl + "&method=" + this.getMethod + "&user=" + this.user + "&ucode=" + this.ucode + "&resid=" + resid + "&subresid=" + subresid + "&cmswhere=" + cmswhere;
        if ((pageSize >0))
        {
             url=url+"&pageIndex="+pageIndex+"&pageSize="+pageSize;
        }
        
        $.ajax({
            url: url,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            success: function (text) {
                if (text !== "") {
                    var data = mini.decode(text);
                    if (data.error == -1) {
                        if (fnError != null) {
                            fnError(data);
                        }
                    }
                    var adata = [];
                    var subdata = [];
                    var total=0;
                    adata = data.data;
                    if (data.total)
                    {  total = data.total;}
                 
                    if (data.subdata != null) {
                        subdata = data.subdata.data;
                    }
                    if (fnSuccess != null) {

                        fnSuccess(adata, subdata,total);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (fnSyserror != null) {
                    fnSyserror(jqXHR, textStatus, errorThrown);
                }
            } });
    };
    dbHelper.prototype.dbSavedata = function (resid, subresid, json, fnSuccess, fnError, fnSyserror) {
        var url;
        url = this.baseUrl + "&method=" + this.saveMethod + "&user=" + this.user + "&ucode=" + this.ucode;
        $.ajax({
            url: url,
            async: false,
            dataType: "jsonp",
            jsonp: "jsoncallback",
            type: 'post',
            data: { data: json, resid: resid },
            cache: false,
            success: function (text) {
                if (text.error == "0") {
                    if (fnSuccess != null) {
                        fnSuccess(text);
                    }
                }
                else {
                    if (fnError != null) {
                        fnError(text);
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if (fnSyserror != null) {
                    fnSyserror(jqXHR, textStatus, errorThrown);
                }
            }
        });
    };
    return dbHelper;
}());
var miniPanel = (function () {
    function miniPanel(element) {
        this.element = element;
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toLocaleTimeString();
    }
    miniPanel.prototype.start = function () {
        var _this = this;
        var jsonString = '{"messge": "ok","error":"-1"}';
        this.timerToken = setInterval(function () { return _this.span.innerHTML = new Date().toLocaleTimeString(); }, 500);
    };
    miniPanel.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    miniPanel.prototype.appendPanel = function (parentelement, panelid, mini, classname, title, url, fnload, expanded, iconCls) {
        this.mini_control = document.createElement('div');
        this.mini_control.id = panelid;
        this.mini_control.className = classname;
        this.mini_control.title = title;
        parentelement.appendChild(this.mini_control);
        mini.parse();
        var aPanel = mini.get(panelid);
        aPanel.set({ "width": "auto", "height": "800", "iconCls": iconCls, "expanded": expanded, "onbuttonclick": "onbuttonclick" });
        aPanel.load(url, function () {
            var iFrame = aPanel.getIFrameEl();
            fnload(iFrame);
        }, null);
    };
    return miniPanel;
}());
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var str=(window.location.href);
    str=str.substr(str.indexOf("?"));
    var r = str.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
function onbuttonclick(e) {
    if (e.name = "collapse") {
        setTimeout(function () {
            if (e.sender.expanded == true) {
                e.sender.set({ "height": "400px" });
            }
        }, 500);
    }
}
