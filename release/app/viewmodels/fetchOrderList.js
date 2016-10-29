jQuery(document).ready(function() {
    
                  var date = new Date();
                  var d = date.getDate();
                  var m = date.getMonth();
                  var y = date.getFullYear();
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