$(document).ready(function () {

  $.get(window.location.origin + '/nextevents', function(findEvents) {
    var events = {};
    var firstEvent = new Date(findEvents[0].startDate).getFullYear() + '/' + new Date(findEvents[0].startDate).getMonth() + '/' + new Date(findEvents[0].startDate).getDate();

    for (var key = 0; key < findEvents.length; key++) {
      var event = findEvents[key];
      var date = new Date(event.startDate).getFullYear() + '/' + new Date(event.startDate).getMonth() + '/' + new Date(event.startDate).getDate();
      events[date] = $('<div><h3>'+ event.name +'</h3><p>'+ event.description +'</p><a href='+ event.link +'>'+ event.link +'</a></div>');
    }

    console.log(events);

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

  // {
  //     '2017/7/12': $('<div><h3>Nome do evento</h3><p>Descrição do evento</p><a href="#">www.link.com.br</a></div>'),
  //     '2017/8/16': $('<div><h3>Nome do evento 2</h3><p>Descrição do evento</p><a href="#">www.link.com.br</a></div>'),
  //     '2017/8/2': $('<div><h3>Nome do evento 5</h3><p>Descrição do evento</p><a href="#">www.link.com.br</a></div>'),
  // }


});
