define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var mid;
    var reserve = function() {
    };
    reserve.prototype.attached=function(){
        mini.parse();
        var form = new mini.Form("form");
        var o =  new mini.Form("form").getData();
        form.validate(); 
        if (form.isValid() == false) return;
        o._id=1;
        o._state="added";
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
        var grid = mini.get("datagrid1");
        var keyText = mini.get("keyText");

        grid.load();

        function onSearchClick(e) {
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
    };
    reserve.show = function(){
        //mid=mdata;
        return dialog.show(new reserve());
    };
    return reserve;
})