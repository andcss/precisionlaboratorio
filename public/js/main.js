$(document).ready(function() {

  /**
   * Open & Close Menu Top
   * ---------------------------------------
   */

  $(document).on('click', '.open-menu.m-close', function(){
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

  $(document).on('click', '.open-menu.open', function(){
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
      html += `<li>
                  <a href="${data[i].link}" target="_black">
                    <img src="${data[i].images.low_resolution.url}"/>
                  </a>
                </li>`;
    }
    html += '</ul>';
    $('#instagramBlock .mural').html(html);
  }
  var token = "";
  $.ajax({
    url: 'https://api.instagram.com/v1/users/self/media/recent/?access_token='+token,
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
        console.log('add');
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
  })




});
