function dateFormat(date) {
  date = new Date(date);
  return date.getFullYear() + '-' + parseInt(date.getMonth()+1) + '-' + date.getDate();
}

function sumDayDate(date) {
  if (!date.getTime)
    date = new Date(date);
  return new Date(date.getTime()+1000*60*60*24);
}

function clickEventDay(id) {
  var date = $("#" + id).data("date");
  var hasEvent = $("#" + id).data("hasEvent");
  var title = $("#" + id).attr("title");
  var description = $("#" + id).attr("description");
  var footer = $("#" + id).attr("footer");
console.log(footer);
  var months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  var date = new Date(date);

  var year = date.getUTCFullYear();
  var day = date.getUTCDate();
  var month = months[date.getMonth()];

  showDateInfo(year, day, month);
  showEventInfo(title, description, footer)
}

function showDateInfo(year, day, month) {
  var htmlElement = `<h2>${day}<small>${month}</small><small>${year}</small></h2>`;
  var elementEvent = $('#showEvent');
  elementEvent.html(htmlElement);
}

function showEventInfo(title, description, footer) {
  var htmlElement = `<h3>${title}</h3><p>${description}</p><strong>${footer}</strong>`;
  $('.descricao').html(htmlElement);
}

$(document).ready(function () {
  if ($('#calendar').is(':visible')) {

    var eventData = [];

    $.get(window.location.origin + '/nextevents', function(findEvents) {
      var footer =  '';
      for (var key = 0; key < findEvents.length; key++) {
        var startDateString = dateFormat(findEvents[key].startDate);
        var endDateString = dateFormat(findEvents[key].endDate);
        var startDate = new Date(findEvents[key].startDate);
        var endDate = new Date(findEvents[key].endDate);
        var oneDay = 24*60*60*1000;

        if (findEvents[key].link != '') {
          footer = `<a href="${findEvents[key].link}">${findEvents[key].linkText}</a>`;
        }
        eventData.push({
          "date": dateFormat(findEvents[key].startDate),
          "badge": false,
          "title": findEvents[key].name,
          "body": findEvents[key].description,
          "footer": footer,
        });

        if (startDateString != endDateString) {
          var diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));

          for (var i = 0; i < diffDays; i++ ) {
            startDate = sumDayDate(startDate);
            eventData.push({
              "date": dateFormat(startDate),
              "badge": false,
              "title": findEvents[key].name,
              "body": findEvents[key].description,
              "footer": footer,
            });
          }
        }
      }

      $("#zubuto-calendar").zabuto_calendar({
        data: eventData,
        language: "pt",
        modal: true,
        action: function () {
          return clickEventDay(this.id);
        },
      });
    });
  }

});
