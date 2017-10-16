$(document).ready(function () {
  if ($('#calendar').is(':visible')) {
    $.get(window.location.origin + '/nextevents', function(findEvents) {
      var events = {};
      var firstEvent = new Date(findEvents[0].startDate).getFullYear() + '/' + new Date(findEvents[0].startDate).getMonth() + '/' + new Date(findEvents[0].startDate).getDate();

      for (var key = 0; key < findEvents.length; key++) {
        var event = findEvents[key];
        var date = new Date(event.startDate).getFullYear() + '/' + new Date(event.startDate).getMonth() + '/' + new Date(event.startDate).getDate();
        events[date] = $('<div><h3>'+ event.name +'</h3><p>'+ event.description +'</p><a href='+ event.link +'>'+ event.link +'</a></div>');
      }

      $('#calendar').tempust({
        date: new Date(firstEvent),
        offset: 1,
        events: events
      });

      $('#calendar').on('changeDate', function (event) {
        $('#output')
        .append('Date Changed!')
        .append('<br/>');
      });

    });    
  }

});
