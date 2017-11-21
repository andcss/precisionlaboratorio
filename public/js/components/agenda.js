function dateFormat(date) {
  date = new Date(date);
  return date.getFullYear() + '-' + parseInt(date.getMonth()+1) + '-' + date.getDate();
}

function myDateFunction(id) {
  var date = $("#" + id).data("date");
  var hasEvent = $("#" + id).data("hasEvent");
  var title = $("#" + id).attr("title");
  var description = $("#" + id).attr("description");
  var footer = $("#" + id).attr("footer");

  console.log(title, description);
}

$(document).ready(function () {
  if ($('#calendar').is(':visible')) {

    var eventData = [];

    $.get(window.location.origin + '/nextevents', function(findEvents) {
      for (var key = 0; key < findEvents.length; key++) {
        eventData.push({
          "date": dateFormat(findEvents[key].startDate),
          "badge":false,
          "title":"Ola pessoas",
          "body":"Descricao ola",
          "footer":"que issso",
        });
      }

      console.log(eventData);

      $("#zubuto-calendar").zabuto_calendar({
        data: eventData,
        language: "pt",
        modal: true,
        action: function () {
          return myDateFunction(this.id);
        },
      });
    });
  }

});
