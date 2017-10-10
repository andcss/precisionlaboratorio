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

    $('.teeth').on('click', function(){
      var teeth = $(this);
      var teethId = teeth.attr('id');

      // Colore/Deslore dentes Clicados
      if(teeth.hasClass('selected')) {
        console.log('clicado');
        teeth.removeClass('selected');
        $('#checkbox-'+teethId).attr('checked', false);
      } else {
        teeth.addClass('selected');
        $('#checkbox-'+teethId).attr('checked', true);
      }
    });

    $('#selectedTeeth input').each(function(key, checkbox) {
      if ($(checkbox).is(':checked')) {
        var nameTeeth = $(checkbox).val();
        $('#'+nameTeeth).addClass('selected');
      }
    });


});
