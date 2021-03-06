define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var baseUrl=appConfig.app.baseUrl;
    var ucode = appConfig.app.ucode;
    var user  = appConfig.app.user;
    var dbs=new dbHelper(baseUrl,user,ucode);
    var subresid=appConfig.meetingroom.subresid;
    var poresid=appConfig.meetingroom.poresid;
    var mid;
    var reservemr = function() {
        
    };
    function onSearchClick(e) {
            var keyText = mini.get("keyText");
            grid.load({
                key: keyText.value
            });
        }
        function onCloseClick(e) {
            var lookup2 = mini.get("lookup2");
            lookup2.hidePopup();
        }
        function onClearClick(e) {
            var lookup2 = mini.get("lookup2");
            lookup2.deselectAll();
        }
    reservemr.prototype.attached=function(){
        mini.parse();
        var urllist=appConfig.app.baseUrl + "&method=" + appConfig.app.getMethod + "&user=" + appConfig.app.user + "&ucode=" + appConfig.app.ucode + "&pageIndex=1&pageSize=10&subresid=0&resid=" + poresid + "&cmswhere=''";
        console.log(urllist);
        // $('#datagrid1').attr('url',urllist);
        var grid = mini.get("datagrid1");
        dbs.dbGetdata(poresid,0,'',fnSuccess,null,null);
        function fnSuccess(mdata){
            console.log(mdata);
            grid.set({data:mdata});
        }
        
        grid.set({url:urllist, ajaxOptions:{dataType:"jsonp",jsonp:"jsoncallback"}});
        grid.load({key:""},loadSuccess,null);
        function loadSuccess(e)
        {
            console.log(e);
        }

        
    };
    reservemr.prototype.ok = function() {
        $('#ok').attr({"disabled":"disabled"});
        var that=this;
        mini.parse();
        var form = new mini.Form("form");
        var o =  new mini.Form("form").getData();
        form.validate(); 
        if (form.isValid() == false) return;
        o._id=1;
        o._state="added";
        o.mid=mid;
        var json = mini.encode([o]);
        dbs.dbSavedata(subresid,0,json,dataSaved,fnerror,fnhttperror);
        function dataSaved(text){
            dialog.showMessage('<h1>申请成功</h1>','会议室申请',['返回'],true);
            setTimeout(function() {
                $(".modal-footer button:contains('确认申请')").next().click();
            }, 1000);
          
        }
        function fnerror(text){
            dialog.showMessage(text,'会议室申请失败',['返回'],true);
            //alert(text);
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            dialog.showMessage('error','会议室申请',['返回'],true);
          
        }
        dialog.close(that);
    };
    reservemr.prototype.cancel = function() {
        dialog.close(this);
    };
    reservemr.show = function(mdata){
        mid=mdata;
        return dialog.show(new reservemr());
    };
    return reservemr;
})