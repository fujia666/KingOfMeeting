define(['plugins/http', 'durandal/app', 'knockout','durandal/system','plugins/router','./flightappform','plugins/dialog'], function (http, app, ko,system,router,flightappform,dialog) {
   
        fetchPage=function(self)
        {

                
                fetchrows(system,self,self.pageSize,self.pageIndex,function(result,data,total){
                    if (result)
                    { 
                            
                        self.rows(data);
                        self.total(total);   
                        mini.parse();
                        
                        
                        }
                    
                    }
                );
        }
        fetchrows= function (system,self,pageSize,pageIndex,callback) {
                var resid=appConfig.internationalfilght.guojiResid;
                var cmswhere="";
            
                appConfig.app.dbs.dbGetdata(resid,"",cmswhere,dataGot,fnerror,fnhttperror,pageSize,pageIndex);
                function dataGot(data,subdata,total)
                {
                    system.log(data);
                    system.log("total="+total);
                    
                    callback(true,data,total);
                }
                function fnerror(data){   

                    alert(data);
                    callback(false);

                }
                function fnhttperror(jqXHR, textStatus, errorThrown){
            
                    system.log(jqXHR);
                    callback(false);
            
                }
        
        };
        bindButtonFunction=function (view,that){
            
            $(view).on("click",'.mini-button',that,function(e){
                            var button=mini.get(this);
                            var self=e.data;
                            var rows=self.rows();

                            if (button.name=='add')
                            {
                                addApplication(self,rows);
                            }
                            if (button.name=='submit')
                            {
                                
                        
                            }
                            if (button.name=='edit')
                            {
                                
                                editApplication(self,rows,button.recid);
        
                            }
                            if (button.name=='cancel')
                            {
                                alert("cancel:"+button.recid);
                            }
                            
                    });
        }
        editApplication=function(self,rows,recid){
            var o=$.grep(rows,function(row,i){return row["REC_ID"]==recid})[0];
                                
                                flightappform.show(o).then(function(response) {
                                system.log(response);
                                
                                var newrows=self.rows().clone();
                                self.rows.removeAll();
                                self.rows(newrows);
                                mini.parse();
                                
                                });
        }
        addApplication=function(self,rows){

                var emptyrow=rows.clone()[0];
                    for(var p in emptyrow) 
                    { 
                        emptyrow[p]=""; 
                    } 
                    flightappform.show(emptyrow).then(function(response){
                            
                                system.log(response);
                                if (response.REC_ID>0)
                                { self.rows.unshift(response);}
                                
                                    
                                    mini.parse();
                                });
        }  
    return {
        
        rows: ko.observableArray([]),
        pageSize:7,
        key:ko.observable(""),
        total:ko.observable(0),
        maxPageIndex: function(){ return ko.pureComputed(function() {
             return Math.ceil(ko.utils.unwrapObservable(this.total) / this.pageSize) - 1;
        }, this);},
        pageIndex:0,
        pageIndexChanged:function(index){   
           this.pageIndex=index;
           fetchPage(this);      
        },
        user:"",
        ucode:"",
        activate:function(){ 
             if ( appConfig.app.dbs==null)
             {
               // dialog.showMessage(data.message,"请先登入系统!");
                alert("请先登入系统");
                router.navigate('#');
                 
             }
            fetchPage(this);

     
        },
        binding: function () {
          
           
        },
        bindingComplete: function () {
         
        },
        attached: function (view, parent) {
           
        },
        
        compositionComplete: function (view) {
              mini.parse();
              var that=this;
              bindButtonFunction(view,that);
        },
        bigImage:function(e,event){
          
            var el=$(event.currentTarget);
            el.css({ 'width': 900 + 'px', 'left': -350 + 'px', 'top': -100 + 'px', zIndex: 5000 });
        },
        smallImage:function(e,event){
          
            var el=$(event.currentTarget);
             el.css({ 'width': 70 + 'px', 'left': 20 + 'px', 'top': 20 + 'px', zIndex: 1 });
        }

    };
   
});
 
 
