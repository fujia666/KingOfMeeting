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
  
    calendar=function(mdata){
		    //console.log(mdata.mid);
        var html="<div id='calendar'></div>";
        //dialog.MessageBox.setViewUrl("views/fetchOrderList.html");
        dialog.showMessage(html,'会议室预定情况',['返回'],true);
				// delete dialog.MessageBox.prototype.viewUrl;
				// dialog.MessageBox.prototype.getView = function () {
       	// 		 return viewEngine.processMarkup(dialog.MessageBox.defaultViewMarkup);
    		// };

              jQuery(document).ready(function() {
    
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
                          var newDate=date.toString();
                          var yyyy=date.getFullYear();
                          var mm=date.getMonth();
                          var dd=date.getDate();
                          $('#calendar').fullCalendar( 'gotoDate', yyyy,mm,dd );
                          $('#calendar').fullCalendar('changeView',"agendaDay")
                      }
                  });
              });
              
         
	  };
    this.floor=function(city,building,floor){//楼层筛选
        //console.log(city);
        //console.log(building);
        //console.log(floor);
        // $('.meeting>button').hide();
        // $('.meeting>button:contains('+floor+')').show();
        // $('.meeting>button:not(:contains('+building+'))').hide();
        // $('.meeting>button:not(:contains('+city+'))').hide();
	  };
    this.building=function(city,building){//筛选幢
        //console.log(city);
        //console.log(building);
        // $('.meeting>button').hide();
        // $('.meeting>button:contains('+building+')').show();
        // $('.meeting>button:not(:contains('+city+'))').hide();
        // $('.floor').hide();
        // $('.'+building).show();
	  };
   cityfilter=function(city,building,floor,self){//筛选城市
        cmswhere="city='"+city+"' AND fname='"+building+"' AND floor='"+floor+"'";
        dbs.dbGetdata(resid,0,cmswhere,fnSuccess,null,fnhttperror);
         function fnSuccess(data,subdata){
                   self.mlist(data);
                  // alert(1);
                   //console.log(self.mlist());
 
                }
         function fnhttperror(jqXHR, textStatus, errorThrown){
                        console.log(jqXHR);
          }
        //console.log(city);
        //console.log(mlist);
       // $('.meeting>button').hide();
       // $('.meeting>button:contains('+city+')').show();
      //  me.building(city,"A");
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
        buildingname:ko.observable(""),
        buildingclicked:function(e,sender){
          console.log(e);

          this.buildingname(sender.target.value);
        },
        mlist:ko.observableArray([]),
        showbuildingA:ko.observable(true),
        cityfilterofsh:function(){
         // setImmediate
         
             cityfilter("上海","A座","二楼",this);
         

             
        },
        cityfilterofwux:function(){

              cityfilter("无锡",this);
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