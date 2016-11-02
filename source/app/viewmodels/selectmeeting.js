define(['durandal/app','knockout','plugins/router','plugins/dialog','durandal/viewEngine','./attendee','durandal/system','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar,viewEngine,attendee,system) {


            baseUrl=appConfig.app.baseUrl;
            getMethod=appConfig.app.getMethod;
            saveMethod=appConfig.app.saveMethod;
            var me=this;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.resid;
            var subresid=appConfig.meetingroom.subresid;
            var poresid=appConfig.meetingroom.poresid;
            var cmswhere="";
            var city;
            var building;
            var floor;
            var newDate;
            var yyyy;
            var mm;
            var dd;
            var mid;

    calendar=function(mdata){
        mid=mdata.mid;
        var html="<div id='calendar'></div>";
        
        
         jQuery(document).ready(function() { //日历控件
            var date = new Date();
		        dd = date.getDate();
		        mm = date.getMonth()+1;
		        yyyy = date.getFullYear();
            var eventJson;
            var reserve=function(){
                cmswhere="mid='"+mid+"'";// AND month='"+yyyy+""+mm+"'";
                dbs.dbGetdata(subresid,0,cmswhere,fnSuccess,null,null)
                function fnSuccess(Json){
                    for(var i = 0; i < Json.length; i++){
                        Json[i].end=(Json[i]).endtime;
                    }
                    eventJson=Json;
                };
                return eventJson;
            };
            reserve();
            setTimeout(function() {
                dialog.showMessage(html,' ',['返回'],true);
                var calendar = jQuery('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    buttonText: {
                        prev: 'prev',
                        next: 'next',
                        prevYear: '&nbsp;&lt;&lt;&nbsp;',
                        nextYear: '&nbsp;&gt;&gt;&nbsp;',
                        today: 'today',
                        month: 'month',
                        week: 'week',
                        day: 'day'
                    },
                    height:500,
                    slotEventOverlap:false,
                    weekMode:"liquid",
                    selectable:true,
                    dayClick: function(date) {
                        yyyy=date.getFullYear();
                        mm=date.getMonth()+1;
                        dd=date.getDate();
                        $('#calendar').fullCalendar( 'gotoDate', yyyy,mm-1,dd );
                        $('#calendar').fullCalendar('changeView','agendaDay');
                    },
                    events:eventJson
                });
                $("h3:contains(' ')").parent().next().next().prepend('<button class="btn btn-primary">我要预定</button>'); 
                $("h3:contains(' ')").parent().hide();
                $(".modal-footer button:contains('我要预定')").click(function(){
                    //mini.parse();
                    
                    
                    var list='<form id="form" class="reserve">'+			
                                  '<table width="600">'+
                                      '<tr>'+
                                          '<td width="20%">使用部门:</td>'+
                                          '<td width="30%">'+
                                              '<input class="mini-hidden" name="mid" value="'+mid+'"/>'+
                                              '<input class="mini-textbox" name="title" required="true"/>'+
                                          '</td>'+
                                          '<td width="20%">召集人:</td>'+
                                          '<td width="30%">'+
                                              '<input class="mini-textbox" name="C3_531241057192" required="true"/>'+
                                          '</td>'+
                                      '</tr>'+
                                      '<tr>'+
                                          '<td>会议开始时间:</td>'+
                                          '<td>'+
                                              '<input name="start" format="yyyy-MM-dd H:mm" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" value="'+yyyy+"-"+mm+"-"+dd+' 9:00" required="true"/>'+
                                          '</td>'+
                                      '</tr>'+
                                      '<tr>'+
                                          '<td>会议结束时间:</td>'+
                                          '<td>'+
                                              '<input name="endtime" format="yyyy-MM-dd H:mm" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" value="'+yyyy+"-"+mm+"-"+dd+' 10:00" required="true"/>'+
                                          '</td>'+
                                      '</tr>'+
                                      '<tr>'+
                                          '<td>参会人员:</td>'+
                                          '<td colspan="4">'+
                                            '<input id="lookup"'+
                                                    'name="C3_531241226642"'+
                                                    'class="mini-lookup"'+
                                                    'style="width:450px"'+
                                                    'popup="#gridPanel"'+
                                                    'grid="#datagrid1"'+
                                                    'multiSelect="true"/>'+
                                            '<div id="gridPanel" class="mini-panel" title="header" iconCls="icon-add" style="width:450px;height:250px;" showToolbar="true" showCloseButton="true" showHeader="false" bodyStyle="padding:0" borderStyle="border:0">'+
                                                '<div property="toolbar" style="padding:5px;padding-left:8px;text-align:center;">'+  
                                                    '<div style="float:left;padding-bottom:2px;">'+            
                                                        '<input id="keyText" class="mini-textbox" style="width:160px;" onenter="onSearchClick"/>'+
                                                        '<a class="mini-button" onclick="attendee">查询</a>'+
                                                        '<a class="mini-button" iconCls="icon-remove" onclick="onClearClick">清空所有</a>'+
                                                    '</div>'+
                                                    '<div style="clear:both;"></div>'+
                                                '</div>'+
                                                '<div id="datagrid1" class="mini-datagrid" style="width:100%;height:100%;"borderStyle="border:0" showPageSize="false" showPageIndex="false"'+
                                                    'url='+appConfig.app.baseUrl + "&method=" + appConfig.app.getMethod + "&user=" + appConfig.app.user + "&ucode=" + appConfig.app.ucode + "&resid=" + poresid + "&cmswhere=''" +
                                                    'ajaxOptions='+"'"+'{dataType:"jsonp",jsonp:"jsoncallback"}'+"'"+'>'+
                                                    '<div property="columns">'+
                                                        '<div type="checkcolumn" ></div>'+
                                                        '<div field="C3_227192484125" width="90" headerAlign="center" allowSort="true">姓名</div>'+    
                                                        '<div field="C3_384367557332" width="150" headerAlign="center" allowSort="true">邮箱</div>'+               
                                                    '</div>'+
                                                '</div>'+                                             
                                            '</div>'+
                                        '</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                        '<td colspan="5">茶歇:</td>'+
                                    '</tr>'+
                                    '<tr>'+
                                          '<td></td>'+
                                          '<td colspan="2">中餐<input name="C3_531241319249" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×15元/份</td>'+
                                          '<td colspan="2">西餐<input name="C3_531241331249" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×50元/份</td>'+
                                      '</tr>'+
                                      '<tr>'+
                                          '<td></td>'+
                                          '<td colspan="2">咖啡<input name="C3_531241275373" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×20元/杯</td>'+
                                          '<td colspan="2">小瓶水<input name="C3_531241265561" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×2元/瓶</td>'+
                                      '</tr>'+
                                  '</table>'+
                            '</form>';

                    
                    
                    //$("h3:contains('会议室预定申请')").parent().next().next().prepend('<span class="lf">合计:'+total+'</span>');
                    
                    mini.parse();
                    var grid = mini.get("datagrid1");
                    var keyText = mini.get("keyText");
                    var keyword = $('#keyText').html();
                    var attendee=function(){
                        cmswhere="C3_227192484125='%"+keyword+"%' OR C3_384367557332='%"+keyword+"%'";
                        dbs.dbGetdata(poresid,0,"",fnSuccess,null,null);
                        function fnSuccess(griddata){
                            
                        };
                    }
                    // grid.load();
                
                    // function onSearchClick(e) {
                    //     grid.load({
                    //         key: keyText.value
                    //     });
                    // }
                    $(".mini-button span:contains('关闭')").click(function(e) {
                        mini.parse();
                        var lookup = mini.get("lookup");
                        lookup.hidePopup();
                    })
                    var onClearClick = function(e) {
                        var lookup = mini.get("lookup");
                        lookup.deselectAll();
                    }
                    dialog.showMessage(list,'会议室预定申请',['返回'],true);
                    $("h3:contains('会议室预定申请')").parent().next().next().prepend('<button class="btn btn-primary">确认申请</button>');
                    mini.parse();
                    $(".modal-footer button:contains('确认申请')").click(function(){
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
                    });
                }); 
            }, 300);
         });
        
        
	  };
                    
    gomeeting=function(self,city,building,floor){//页面输出
        
        if(building===undefined&&floor===undefined){
            cmswhere="city='"+city+"'";
        }else if(building!=undefined&&floor===undefined){
            cmswhere="city='"+city+"' AND fname='"+building+"'";
        }else if(building===undefined&&floor!=undefined){
            cmswhere="city='"+city+"' AND floor='"+floor+"'";
        }else{
            cmswhere="city='"+city+"' AND fname='"+building+"' AND floor='"+floor+"'";
        }
        dbs.dbGetdata(resid,0,cmswhere,fnSuccess,null,fnhttperror);
        function fnSuccess(data){
            self.mlist(data);
 
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            //console.log(jqXHR);
        }
	};
    return {
		activate:function(){},
        attached:function(){
            
            (function($) {
              
                    function Collapse (el, options) {
                        options = options || {};
                        var _this = this,
                        query = options.query || "> :even";
              
                        $.extend(_this, {
                            $el: el,
                            options : options,
                            sections: [],
                            isAccordion : options.accordion || false,
                            db : options.persist ? jQueryCollapseStorage(el[0].id) : false
                        });
            
                        _this.states = _this.db ? _this.db.read() : [];
            
                        _this.$el.find(query).each(function() {
                            var section = new Section($(this), _this);
                            _this.sections.push(section);

                            var state = _this.states[section._index()];
                            if(state === 0) {
                              section.$summary.removeClass("open");
                            }
                            if(state === 1) {
                              section.$summary.addClass("open");
                            }

                            if(section.$summary.hasClass("open")) {
                              section.open(true);
                            }
                            else {
                              section.close(true);
                            }
                        });
            
                        (function(scope) {
                            _this.$el.on("click", "[data-collapse-summary]",
                            $.proxy(_this.handleClick, scope));
                        }(_this));
                    }  
          
                    Collapse.prototype = {
                        handleClick: function(e) {
                            e.preventDefault();
                            var sections = this.sections,
                            l = sections.length;
                            while(l--) {
                                if($.contains(sections[l].$summary[0], e.target)) {
                                    sections[l].toggle();
                                    break;
                                }
                            }
                        },
                        open : function(eq) {
                            if(isFinite(eq)) return this.sections[eq].open();
                            $.each(this.sections, function() {
                              this.open();
                            });
                        },
                        close: function(eq) {
                            if(isFinite(eq)) return this.sections[eq].close();
                            $.each(this.sections, function() {
                                this.close();
                            });
                        }
                    };
          
                    function Section($el, parent) {
                        $.extend(this, {
                            isOpen : false,
                            $summary : $el.attr("data-collapse-summary", "").wrapInner('<a href="#"/>'),
                            $details : $el.next(),
                            options: parent.options,
                            parent: parent
                        });
                    }
          
                    Section.prototype = {
                        toggle : function() {
                            if(this.isOpen) this.close();
                            else this.open();
                        },
                        close: function(bypass) {
                            this._changeState("close1", bypass);
                        },
                        open: function(bypass) {
                            var _this = this;
                            if(_this.options.accordion && !bypass) {
                              $.each(_this.parent.sections, function() {
                                this.close();
                              });
                            }
                            _this._changeState("open", bypass);
                        },
                        _index: function() {
                            return $.inArray(this, this.parent.sections);
                        },
                        _changeState: function(state, bypass) {
                          
                            var _this = this;
                            _this.isOpen = state == "open";
                            if($.isFunction(_this.options[state]) && !bypass) {
                                _this.options[state].apply(_this.$details);
                            } else {
                                if(_this.isOpen) _this.$details.show();
                                else _this.$details.hide();
                            }
                            _this.$summary.removeClass("open close1").addClass(state);
                            _this.$details.attr("aria-hidden", state == "close1");
                            _this.parent.$el.trigger(state, _this);
                            if(_this.parent.db) {
                                _this.parent.db.write(_this._index(), _this.isOpen);
                            }
                        }
                    };
          
                    $.fn.extend({
                        collapse: function(options, scan) {
                            var nodes = (scan) ? $("body").find("[data-collapse]") : $(this);
                            return nodes.each(function() {
                                var settings = (scan) ? {} : options,
                                values = $(this).attr("data-collapse") || "";
                                $.each(values.split(" "), function(i,v) {
                                    if(v) settings[v] = true;
                                });
                            new jQueryCollapse($(this), settings);
                            });
                        }
                    });
          
                    $(function() {
                      $.fn.collapse(false, true);
                    });
                
                    jQueryCollapse = Collapse;
          
            })(window.jQuery);
            setTimeout(function() {
                $("#example").collapse({
                    accordion: true,
                    open: function() {
                        this.addClass("open");
                        this.css({ height: "450px" });
                    },
                    close1: function() {
                        this.css({ height: "0px" });
                        this.removeClass("open");
                    }
                });
            }, 50);
        },
        mlist:ko.observableArray([]),
        cityfilterofsh:function(){//筛选城市
            city="上海";
            gomeeting(this,city);
        },
        cityfilterofwx:function(){//筛选城市
            city="无锡";
            gomeeting(this,city);
        },
        buildingfilterA:function(){//筛选幢
            building="A座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterB:function(){//筛选幢
            building="B座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterC:function(){//筛选幢
            building="C座";
            gomeeting(this,city,building,floor)
        },
        buildingfilterD:function(){//筛选幢
            building="D座";
            gomeeting(this,city,building,floor);
        },
        buildingfilterE:function(){//筛选幢
            building="E座";
            gomeeting(this,city,building,floor);
        },
        floorfilter6F:function(){//筛选楼层
            floor="6F";
            gomeeting(this,city,building,floor);
        },
        floorfilter5F:function(){//筛选楼层
            floor="5F";
            gomeeting(this,city,building,floor);
        },
        floorfilter4F:function(){//筛选楼层
            floor="4F";
            gomeeting(this,city,building,floor);
        },
        floorfilter3F:function(){//筛选楼层
            floor="3F";
            gomeeting(this,city,building,floor);
        },
        floorfilter2F:function(){//筛选楼层
            floor="2F";
            gomeeting(this,city,building,floor);
        },
        floorfilter1F:function(){//筛选楼层
            floor="1F";
            gomeeting(this,city,building,floor);
        }
    }
})
