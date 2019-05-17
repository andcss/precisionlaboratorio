$(document).ready(function() {

  // Dasabilitar Função menu com click direto do mouse
  //document.addEventListener('contextmenu', event => event.preventDefault());
  /**
   * Open & Close Menu Top
   * ---------------------------------------
   */
  $(document).on('click touchstart', '.m-close', function(){
    $(this).removeClass('m-close');
    $(this).addClass('open');

    $('.logo-top').addClass('opened');

    $('.menu-opened').removeClass('closed');
    $('.menu-opened').addClass('opened');

    setTimeout(function() {
      $('.menu-opened ul li').removeClass('hideMenu');
      $('.menu-opened ul li').addClass('show');
    }, 200);
  });

  $(document).on('click touchstart', '.open', function(){
    $(this).removeClass('open');
    $(this).addClass('m-close');

    $('.logo-top').removeClass('opened');

    $('.menu-opened ul li').removeClass('show');
    $('.menu-opened ul li').addClass('hideMenu');
    setTimeout(function() {
      $('.menu-opened').addClass('closed');
      $('.menu-opened').removeClass('opened');
      $('.menu-opened ul li').removeClass('show');
    }, 300);

  });

  /**
   * Instagram Footer
   * ---------------------------------------
   */
  function mostraInstagram(data) {
    var maxImage = 4;
    var html = '<ul>';
    for (var i = 0; i < maxImage; i++) {
      html += '<li><a href="'+data[i].link+'" target="_black" style="background-image: url(\''+ data[i].images.low_resolution.url+'\')"></a></li>';
    }
    html += '</ul>';
    $('#instagramBlock .mural').html(html);
  }

  let instaToken = '1463654275.1677ed0.168f0b64d4a34bae957c05495370c7a1'
  $.ajax({
    url: 'https://api.instagram.com/v1/users/1463654275/media/recent/?access_token=' + instaToken,
    type: 'GET',
    crossDomain: true,
    dataType: 'jsonp',
    success: function(infosInsta) {
      mostraInstagram(infosInsta.data);
    },
    error: function() { console.log('Instagram Fail!'); },
  });


  /**
   * Fixed Menu com scroll
   * ---------------------------------------
   */
  $(window).on('scroll', function() {
    if ($('#menuTop').hasClass('black')) {
      if (window.pageYOffset > 50) {
        $('#menuTop').removeClass('absolute').addClass('fixed');
      }
      if (window.pageYOffset <= 50 && $('#menuTop').hasClass('fixed')) {
        $('#menuTop').addClass('absolute').removeClass('fixed');
      }
    }
  });

  /**
   * Tela de cadastro
   * ---------------------------------------
   */
  $(document).on('click', '.cadastro', function() {
    $('#divider').addClass('active');
    $('#signup').addClass('active');
  });

  $(document).on('click', '.openRecuperar', function() {
    $('#login').css({'display': 'none'});
    $('#forgot').css({'display': 'flex'});
  });

  $(document).on('click', '.openLogin', function() {
    $('#forgot').css({'display': 'none'});
    $('#login').css({'display': 'flex'});
  });

  /**
   * Mascaras para inputs
   * ---------------------------------------
   */
  $('#telefone').mask('(00) 00000-0000');

});
/*Teste*/
