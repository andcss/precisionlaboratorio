function dateFormat(date) {
  date = new Date(date);
  return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
}

function sumDayDate(date) {
  if (!date.getTime)
    date = new Date(date);
  return new Date(date.getTime()+1000*60*60*24);
}

$(document).ready(function () {
  if ($('#calendar').is(':visible')) {
    $.get(window.location.origin + '/nextevents', function(findEvents) {

      var events = {};
      var firstEvent = new Date(findEvents[0].startDate).getFullYear() + '/' + new Date(findEvents[0].startDate).getMonth() + '/' + new Date(findEvents[0].startDate).getDate();

      for (var key = 0; key < findEvents.length; key++) {
        var event = findEvents[key];
        var startDate = dateFormat(event.startDate);
        var endDate = dateFormat(event.endDate);

        if (startDate == endDate) {
          events[startDate] = $('<div><h3>'+ event.name +'</h3><p>'+ event.description +'</p><a href='+ event.link +'>'+ event.link +'</a></div>');
        } else {
          do {
            events[startDate] = $('<div><h3>'+ event.name +'</h3><p>'+ event.description +'</p><a href='+ event.link +'>'+ event.link +'</a></div>');
            event.startDate = sumDayDate(event.startDate)
            startDate = dateFormat(event.startDate);
          } while(startDate != endDate)
        }
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
