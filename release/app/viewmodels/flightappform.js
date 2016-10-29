define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var flightappform = function() {
     
    };
    flightappform.prototype.data;
    flightappform.prototype.close = function() {

        dialog.close(this,this.data);              
    };
    flightappform.prototype.ok = function() {
        var o =  new mini.Form("form3").getData();
        var that=this;
        o._id=1;
        if (that.data.REC_ID>0)
        {  o._state="modified";}
        else
        {
             o._state="added";
        }

      
        o.REC_ID=that.data.REC_ID;
        var json = mini.encode([o]);
        
        appConfig.app.dbs.dbSavedata(appConfig.internationalfilght.guojiResid,0,json,dataSaved,fnerror,fnhttperror);
                    function dataSaved(text){
                         
                        dialog.showMessage('申请成功',"NewFlight");
                        for(var p in  text.data[0]) 
                         { 
                            if (that.data.hasOwnProperty(p))
                             { 
                                that.data[p]=text.data[0][p];
                                 }
                             
                         } 
                         dialog.close(that,text.data[0]);
                    }
                    function fnerror(text){
                        alert("申请失败");
                    }
                    function fnhttperror(jqXHR, textStatus, errorThrown){
                        alert("error");
                    }
        
    };
    flightappform.prototype.attached=function(){
       
        mini.parse();
        new mini.Form("form3").setData(this.data);
      
         var fileupload = mini.get("fileupload1");
         fileupload.setUploadUrl(appConfig.app.uploadFileUrl+"?savepath=e:\\web\\rispweb\\upfiles&httppath="+appConfig.app.httppath);

        var imgfield=mini.get('imgurl');
         var imgurl= imgfield.getValue();
                if (imgurl)
                {
                    var img=$("#imgUploaded");
                    img[0].src=imgurl;
                }
                var fileupload2 = mini.get("fileupload2");
                fileupload2.setUploadUrl(appConfig.app.uploadFileUrl+"?savepath=e:\\web\\rispweb\\upfiles&httppath="+appConfig.app.httppath);

                var imgfield2=mini.get('imgurl2'); 
                var imgurl2= imgfield2.getValue();
                if (imgurl2)
                {
                   var img=$("#imgUploaded2");
                    img[0].src=imgurl2;
                }

    };

    flightappform.prototype.canDeactivate = function () {
        return true;
        
    };

    flightappform.show = function(formdata){
        flightappform.prototype.data=formdata;
        return dialog.show(new flightappform());
    };
    
  
           
       
    return flightappform;
});