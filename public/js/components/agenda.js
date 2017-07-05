$(document).ready(function () {

  $("#calendar").tempust({
      date: new Date("2017/7/12"),
      offset: 1,
      events: {
          "2017/7/12": $("<div><h3>Nome do evento</h3><p>Descrição do evento</p><a href='#'>www.link.com.br</a></div>"),
          "2017/8/16": $("<div><h3>Nome do evento</h3><p>Descrição do evento</p><a href='#'>www.link.com.br</a></div>"),
          "2018/2/16": $("<div><h3>Nome do evento</h3><p>Descrição do evento</p><a href='#'>www.link.com.br</a></div>"),
      }
  });

  $("#calendar").on("changeDate", function (event) {
      $("#output")
      .append("Date Changed!")
      .append("<br/>");
  });



});
