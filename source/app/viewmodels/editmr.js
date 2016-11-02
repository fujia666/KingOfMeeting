define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var mid;
    var editmr = function() {
    };
    editmr.prototype.attached=function(){
        
        mini.parse();
        var baseUrl=appConfig.app.baseUrl;
        var ucode = appConfig.app.ucode;
        var user  = appConfig.app.user;
        var dbs=new dbHelper(baseUrl,user,ucode);
        var resid=appConfig.meetingroom.resid;
        var cmswhere="mid="+mid;
        console.log(cmswhere);
        dbs.dbGetdata(resid,0,cmswhere,fnSuccess,null,null);
        function fnSuccess(data,subdata){
            mini.parse();
            var form = new mini.Form("editform");
            form.setData(data[0]);
            var fileupload=mini.get("fileupload1");
            fileupload.setUploadUrl(appConfig.app.uploadFileUrl+appConfig.app.uppath+appConfig.app.httppath);
            var imgfield=mini.get('imgurl');
            var imgurl=imgfield.getValue();
            if (imgurl)
            { 
                var img=$("#imgUploaded");
                img[0].src=imgurl;
            }   
        }
        saveClick=function(){
            mini.parse();
            var form = new mini.Form("editform");
            var o =  new mini.Form("editform").getData();
            form.validate(); 
            if (form.isValid() == false) return;
            o._id=1;
            o._state="modified";
            var json = mini.encode([o]);
            dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
            function dataSaved(text){
                dialog.showMessage('<h1>修改成功</h1>','会议室新增',['返回'],true);
                $('.modalBlockout').remove();
                $('#editform').remove();
            }
            function fnerror(text){
                dialog.showMessage(text,'修改失败',['返回'],true);
            }
            function fnhttperror(jqXHR, textStatus, errorThrown){
                dialog.showMessage('error','会议室新增',['返回'],true);
            }
        }
    };
    editmr.show = function(mdata){
        mid=mdata;
        return dialog.show(new editmr());
    };
    
  
           
       
    return editmr;
    // return {
    //     editmr,
    //     activate:function(){},
    //     attached:function(){
            
    //         baseUrl=appConfig.app.baseUrl;
    //         var ucode = appConfig.app.ucode;
    //         var user  = appConfig.app.user;
    //         var dbs=new dbHelper(baseUrl,user,ucode);
    //         var resid=appConfig.meetingroom.resid;
    //         mini.parse();

    //         var fileupload = mini.get("fileupload1");
    //         fileupload.setUploadUrl(appConfig.app.uploadFileUrl+"?savepath=e:\\web\\rispweb\\upfiles&httppath="+appConfig.app.httppath);
    //         var imgfield=mini.get('imgurl');
    //         var imgurl= imgfield.getValue();
    //         if (imgurl)
    //         {
    //             var img=$("#imgUploaded");
    //             img[0].src=imgurl;
    //         }


    //         saveClick=function(){
    //                 mini.parse();
    //                 var form = new mini.Form("form");
    //                 var o =  new mini.Form("form").getData();
    //                 form.validate(); 
    //                 if (form.isValid() == false) return;
    //                 o._id=1;
    //                 o._state="added";
    //                 var json = mini.encode([o]);
    //                 dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
    //                 function dataSaved(text){
    //                     dialog.showMessage('<h1>添加成功</h1>','会议室新增',['返回'],true);
    //                     $('#imgurl').val("");
    //                 }
    //                 function fnerror(text){
    //                     dialog.showMessage('<h1>添加失败</h1>','会议室新增',['返回'],true);
    //                     $('.mini-textbox').attr("value","");
    //                     console.log(text);
    //                 }
    //                 function fnhttperror(jqXHR, textStatus, errorThrown){
    //                     dialog.showMessage('error','会议室新增',['返回'],true);
    //                     $('.mini-textbox').attr("value","");
    //                 }
    //                 $('input[name="tel"]').val("");
    //                 $('input[name="mname"]').val("");
    //                 $('input[name="mrimage"]').val("");
    //                 $('#imgUploaded').attr("src","");

    //         }  
    //     }
    // }
})