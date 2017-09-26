$(document).ready(function(){

    // Open Calendar Picker
    $.fn.datetimepicker.dates['pt'] = {
      days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabádo", "Domingo"],
      daysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
      daysMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
      months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthsShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Otu", "Nov", "Dez"],
      today: "Hoje"
    };

    $('.datepicker').datetimepicker({
      format: 'dd/mm/yyyy hh:ii',
      fontAwesome: true,
      language: 'br',
      autoclose: true,
    });


});
