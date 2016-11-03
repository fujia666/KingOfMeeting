define(['durandal/app','knockout','plugins/router','plugins/dialog','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar) {
    var mid;
    var calendar = function() {
    };
    calendar.prototype.attached=function(){
        
        
    };
    calendar.show = function(mdata){
        mid=mdata;
        return dialog.show(new calendar());
    };
    
  
           
       
    return calendar;
})