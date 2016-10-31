define(['durandal/app','knockout','plugins/router','plugins/dialog','durandal/viewEngine','calendar/fullcalendar'], function (app,ko,router,dialog,fullcalendar,viewEngine) {
            baseUrl=appConfig.app.baseUrl;
            getMethod=appConfig.app.getMethod;
            saveMethod=appConfig.app.saveMethod;
            var me=this;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.resid;
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
        //console.log(mid);
        var html="<div id='calendar'></div>";
        //dialog.MessageBox.setViewUrl("views/fetchOrderList.html");
        dialog.showMessage(html,'会议室预定情况',['返回'],true);
				// delete dialog.MessageBox.prototype.viewUrl;
				// dialog.MessageBox.prototype.getView = function () {
       	// 	  return viewEngine.processMarkup(dialog.MessageBox.defaultViewMarkup);
    		// };

        jQuery(document).ready(function() { 
            var date = new Date();
		        dd = date.getDate();
		        mm = date.getMonth();
		        yyyy = date.getFullYear();
            //setTimeout(`
                var calendar = jQuery('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    height:400,
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
                    selectable:true,
                    dayClick: function(date) {
                        newDate=date.toString();
                        yyyy=date.getFullYear();
                        mm=date.getMonth();
                        dd=date.getDate();
                        $('#calendar').fullCalendar( 'gotoDate', yyyy,mm,dd );
                        $('#calendar').fullCalendar('changeView','agendaDay')
                    }
                });
            //`,300)
            $("h3:contains('会议室预定情况')").parent().next().next().prepend('<button class="btn btn-primary">我要预定</button>');
        });
        
            $(".modal-footer button:contains('我要预定')").click(function(){

            ++mm;
            
            var list=`<form id="form" class="reserve">			
                          <table width="600" border="5px" bordercolor="#fff">
                              <tr>
                                  <td width="20%">使用部门:</td>
                                  <td width="30%">
                                      <input class="mini-hidden" name="mid" value="`+mid+`"/>
                                      <input class="mini-textbox" name="C3_531241040499" required="true"/>
                                  </td>
                                  <td width="20%">召集人:</td>
                                  <td width="30%">
                                      <input class="mini-textbox" name="C3_531241057192" required="true"/>
                                  </td>
                              </tr>
                              <tr>
                                  <td>会议开始时间:</td>
                                  <td>
                                      <input name="C3_531241203263" format="yyyy-MM-dd H:mm:ss" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" value="`+yyyy+"-"+mm+"-"+dd+` 9:00:00" required="true"/>
                                  </td>
                              </tr>
                              <tr>
                                  <td>会议结束时间:</td>
                                  <td>
                                      <input name="C3_531241215834" format="yyyy-MM-dd H:mm:ss" style="width:250px" class="mini-datepicker" showOkButton="true" showTime="true" value="`+yyyy+"-"+mm+"-"+dd+` 10:00:00" required="true"/>
                                  </td>
                              </tr>
                              <tr>
                                  <td>参会人员:</td>
                                  <td colspan="4">
                                      <input name="C3_531241226642" class="mini-buttonedit" style="width:450px" required="true"/>
                                  </td>
                              </tr>
                              <tr>
                                  <td colspan="5">
                                      茶歇:
                                  </td>
                              </tr>
                              <tr>    
                                  <td>
                                  </td>
                                  <td colspan="2">   
                                      中餐
                                      <input name="C3_531241319249" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×15元/份
                                  </td>
                                  <td colspan="2">    
                                      西餐
                                      <input name="C3_531241331249" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×50元/份
                                  </td>
                              </tr> 
                              <tr>
                                  <td>
                                  </td>
                                  <td colspan="2">    
                                      咖啡
                                      <input name="C3_531241275373" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×20元/杯
                                  </td>
                                  <td colspan="2">
                                      小瓶水
                                      <input name="C3_531241265561" class="mini-spinner" style="width:55px;text-align:right" minValue="0" maxValue="99">×2元/瓶
                                  </td>
                              </tr>   
                          </table>
                    </form>`;
                    
            dialog.showMessage(list,'会议室预定申请',['返回'],true);
            $("h3:contains('会议室预定申请')").parent().next().next().prepend('<button class="btn btn-primary">确认申请</button>');
            baseUrl=appConfig.app.baseUrl;
            var ucode = appConfig.app.ucode;
            var user  = appConfig.app.user;
            var dbs=new dbHelper(baseUrl,user,ucode);
            var resid=appConfig.meetingroom.subresid;
            mini.parse();
            $(".modal-footer button:contains('确认申请')").click(function(){
                 mini.parse();
                    var form = new mini.Form("form");
                    var o =  new mini.Form("form").getData();
                    form.validate(); 
                    if (form.isValid() == false) return;
                    o._id=1;
                    //console.log(mid);
                    o._state="added";
                    var json = mini.encode([o]);
                    dbs.dbSavedata(resid,0,json,dataSaved,fnerror,fnhttperror);
                    function dataSaved(text){
                        dialog.showMessage('<h1>申请成功</h1>','会议室申请',['返回'],true);
                        setTimeout(function() {
                            $(".modal-footer button:contains('确认申请')").next().click();
                        }, 1500);
                        
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
	  };
    gomeeting=function(self,city,building,floor){//页面输出
        // console.log("city="+city);
        // console.log("building="+building);
        // console.log("floor="+floor);
        
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
        function fnSuccess(data,subdata){
            self.mlist(data);
 
        }
        function fnhttperror(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
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
                  $summary : $el
                    .attr("data-collapse-summary", "")
                    .wrapInner('<a href="#"/>'),
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
            gomeeting(this,city,building,floor);
         
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
}   
)








                   
                    //console.log(mlist);
                    // mini.parse();
                    // var form = new mini.Form("#form2");
                    // form.setData(data[0]);                        
                    // mini.parse();
                    // var fileupload=mini.get("fileupload1");//上传图片
                    // fileupload.setUploadUrl(appConfig.app.uploadFileUrl+"?savepath=e:\\web\\rispweb\\upfiles&httppath="+appConfig.app.httppath);
                    // var imgfield=mini.get('imgurl');
                    // var imgurl=imgfield.getValue();
                    // if (imgurl)
                    // { 
                    //     var img=$("#imgUploaded");
                    //     img[0].src=imgurl;
                    // }   
                    // var fileupload2 = mini.get("fileupload2");
                    // fileupload2.setUploadUrl(appConfig.app.uploadFileUrl+"?savepath=e:\\web\\rispweb\\upfiles&httppath="+appConfig.app.httppath);
                    // var imgfield2=mini.get('imgurl2'); 
                    // var imgurl2= imgfield2.getValue();
                    // if (imgurl2)
                    // {
                    // var img=$("#imgUploaded2");
                    //     img[0].src=imgurl2;
                    // }


// [         
        //     {mid:"101",city:"上海",fname:"A座",floor:"1F",mname:"第一会议室"},
        //     {mid:"102",city:"上海",fname:"A座",floor:"1F",mname:"第二会议室"},
        //     {mid:"103",city:"上海",fname:"A座",floor:"1F",mname:"第三会议室"},
        //     {mid:"104",city:"上海",fname:"A座",floor:"1F",mname:"第四会议室"},
        //     {mid:"105",city:"上海",fname:"A座",floor:"1F",mname:"第五会议室"},
        //     {mid:"106",city:"上海",fname:"A座",floor:"2F",mname:"第一会议室"},
        //     {mid:"107",city:"上海",fname:"A座",floor:"2F",mname:"第二会议室"},
        //     {mid:"108",city:"上海",fname:"A座",floor:"2F",mname:"第三会议室"},
        //     {mid:"109",city:"上海",fname:"A座",floor:"2F",mname:"第四会议室"},
        //     {mid:"110",city:"上海",fname:"A座",floor:"2F",mname:"第五会议室"},
        //     {mid:"111",city:"上海",fname:"A座",floor:"3F",mname:"第一会议室"},
        //     {mid:"112",city:"上海",fname:"A座",floor:"3F",mname:"第二会议室"},
        //     {mid:"113",city:"上海",fname:"A座",floor:"3F",mname:"第三会议室"},
        //     {mid:"114",city:"上海",fname:"A座",floor:"3F",mname:"第四会议室"},
        //     {mid:"115",city:"上海",fname:"A座",floor:"3F",mname:"第五会议室"},
        //     {mid:"116",city:"上海",fname:"B座",floor:"1F",mname:"第一会议室"},
        //     {mid:"117",city:"上海",fname:"B座",floor:"1F",mname:"第二会议室"},
        //     {mid:"118",city:"上海",fname:"B座",floor:"1F",mname:"第三会议室"},
        //     {mid:"119",city:"上海",fname:"B座",floor:"1F",mname:"第四会议室"},
        //     {mid:"120",city:"上海",fname:"B座",floor:"1F",mname:"第五会议室"},
        //     {mid:"121",city:"上海",fname:"B座",floor:"2F",mname:"第一会议室"},
        //     {mid:"122",city:"上海",fname:"B座",floor:"2F",mname:"第二会议室"},
        //     {mid:"123",city:"上海",fname:"B座",floor:"2F",mname:"第三会议室"},
        //     {mid:"124",city:"上海",fname:"B座",floor:"2F",mname:"第四会议室"},
        //     {mid:"125",city:"上海",fname:"B座",floor:"2F",mname:"第五会议室"},
        //     {mid:"126",city:"上海",fname:"B座",floor:"3F",mname:"第一会议室"},
        //     {mid:"127",city:"上海",fname:"B座",floor:"3F",mname:"第二会议室"},
        //     {mid:"128",city:"上海",fname:"B座",floor:"3F",mname:"第三会议室"},
        //     {mid:"129",city:"上海",fname:"B座",floor:"3F",mname:"第四会议室"},
        //     {mid:"130",city:"上海",fname:"B座",floor:"3F",mname:"第五会议室"},
        //     {mid:"131",city:"上海",fname:"C座",floor:"1F",mname:"第一会议室"},
        //     {mid:"132",city:"上海",fname:"C座",floor:"1F",mname:"第二会议室"},
        //     {mid:"133",city:"上海",fname:"C座",floor:"1F",mname:"第三会议室"},
        //     {mid:"134",city:"上海",fname:"C座",floor:"1F",mname:"第四会议室"},
        //     {mid:"135",city:"上海",fname:"C座",floor:"1F",mname:"第五会议室"},
        //     {mid:"136",city:"上海",fname:"C座",floor:"2F",mname:"第一会议室"},
        //     {mid:"137",city:"上海",fname:"C座",floor:"2F",mname:"第二会议室"},
        //     {mid:"138",city:"上海",fname:"C座",floor:"2F",mname:"第三会议室"},
        //     {mid:"139",city:"上海",fname:"C座",floor:"2F",mname:"第四会议室"},
        //     {mid:"140",city:"上海",fname:"C座",floor:"2F",mname:"第五会议室"},
        //     {mid:"141",city:"上海",fname:"C座",floor:"3F",mname:"第一会议室"},
        //     {mid:"142",city:"上海",fname:"C座",floor:"3F",mname:"第二会议室"},
        //     {mid:"143",city:"上海",fname:"C座",floor:"3F",mname:"第三会议室"},
        //     {mid:"144",city:"上海",fname:"C座",floor:"3F",mname:"第四会议室"},
        //     {mid:"145",city:"上海",fname:"C座",floor:"3F",mname:"第五会议室"},
        //     {mid:"201",city:"无锡",fname:"A座",floor:"1F",mname:"第一会议室"},
        //     {mid:"202",city:"无锡",fname:"A座",floor:"1F",mname:"第二会议室"},
        //     {mid:"203",city:"无锡",fname:"A座",floor:"1F",mname:"第三会议室"},
        //     {mid:"204",city:"无锡",fname:"A座",floor:"1F",mname:"第四会议室"},
        //     {mid:"205",city:"无锡",fname:"A座",floor:"1F",mname:"第五会议室"},
        //     {mid:"206",city:"无锡",fname:"A座",floor:"2F",mname:"第一会议室"},
        //     {mid:"207",city:"无锡",fname:"A座",floor:"2F",mname:"第二会议室"},
        //     {mid:"208",city:"无锡",fname:"A座",floor:"2F",mname:"第三会议室"},
        //     {mid:"209",city:"无锡",fname:"A座",floor:"2F",mname:"第四会议室"},
        //     {mid:"210",city:"无锡",fname:"A座",floor:"2F",mname:"第五会议室"},
        //     {mid:"211",city:"无锡",fname:"A座",floor:"3F",mname:"第一会议室"},
        //     {mid:"212",city:"无锡",fname:"A座",floor:"3F",mname:"第二会议室"},
        //     {mid:"213",city:"无锡",fname:"A座",floor:"3F",mname:"第三会议室"},
        //     {mid:"214",city:"无锡",fname:"A座",floor:"3F",mname:"第四会议室"},
        //     {mid:"215",city:"无锡",fname:"A座",floor:"3F",mname:"第五会议室"},
        //     {mid:"216",city:"无锡",fname:"B座",floor:"1F",mname:"第一会议室"},
        //     {mid:"217",city:"无锡",fname:"B座",floor:"1F",mname:"第二会议室"},
        //     {mid:"218",city:"无锡",fname:"B座",floor:"1F",mname:"第三会议室"},
        //     {mid:"219",city:"无锡",fname:"B座",floor:"1F",mname:"第四会议室"},
        //     {mid:"220",city:"无锡",fname:"B座",floor:"1F",mname:"第五会议室"},
        //     {mid:"221",city:"无锡",fname:"B座",floor:"2F",mname:"第一会议室"},
        //     {mid:"222",city:"无锡",fname:"B座",floor:"2F",mname:"第二会议室"},
        //     {mid:"223",city:"无锡",fname:"B座",floor:"2F",mname:"第三会议室"},
        //     {mid:"224",city:"无锡",fname:"B座",floor:"2F",mname:"第四会议室"},
        //     {mid:"225",city:"无锡",fname:"B座",floor:"2F",mname:"第五会议室"},
        //     {mid:"226",city:"无锡",fname:"B座",floor:"3F",mname:"第一会议室"},
        //     {mid:"227",city:"无锡",fname:"B座",floor:"3F",mname:"第二会议室"},
        //     {mid:"228",city:"无锡",fname:"B座",floor:"3F",mname:"第三会议室"},
        //     {mid:"229",city:"无锡",fname:"B座",floor:"3F",mname:"第四会议室"},
        //     {mid:"230",city:"无锡",fname:"B座",floor:"3F",mname:"第五会议室"},
        //     {mid:"231",city:"无锡",fname:"C座",floor:"1F",mname:"第一会议室"},
        //     {mid:"232",city:"无锡",fname:"C座",floor:"1F",mname:"第二会议室"},
        //     {mid:"233",city:"无锡",fname:"C座",floor:"1F",mname:"第三会议室"},
        //     {mid:"234",city:"无锡",fname:"C座",floor:"1F",mname:"第四会议室"},
        //     {mid:"235",city:"无锡",fname:"C座",floor:"1F",mname:"第五会议室"},
        //     {mid:"236",city:"无锡",fname:"C座",floor:"2F",mname:"第一会议室"},
        //     {mid:"237",city:"无锡",fname:"C座",floor:"2F",mname:"第二会议室"},
        //     {mid:"238",city:"无锡",fname:"C座",floor:"2F",mname:"第三会议室"},
        //     {mid:"239",city:"无锡",fname:"C座",floor:"2F",mname:"第四会议室"},
        //     {mid:"240",city:"无锡",fname:"C座",floor:"2F",mname:"第五会议室"},
        //     {mid:"241",city:"无锡",fname:"C座",floor:"3F",mname:"第一会议室"},
        //     {mid:"242",city:"无锡",fname:"C座",floor:"3F",mname:"第二会议室"},
        //     {mid:"243",city:"无锡",fname:"C座",floor:"3F",mname:"第三会议室"},
        //     {mid:"244",city:"无锡",fname:"C座",floor:"3F",mname:"第四会议室"},
        //     {mid:"245",city:"无锡",fname:"C座",floor:"3F",mname:"第五会议室"}
        // ]