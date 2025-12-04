$(function(){

  /*Модальное окно*/

  $('.openpopup').on('click', function(e){
    e.preventDefault();
    
    let target = $(this).data('modal');
    if(target){
      $('#' + target).addClass('show');
      $('.modal-overlay').addClass('show');
      $('body').addClass('popup-open');
    }
  })

    if($('#modal-welcome').length){
      setTimeout(function(){
        $('#modal-welcome').addClass('show');
        $('.modal-overlay').addClass('show');
        $('body').addClass('popup-open');
      }, 4000);
    }

  $('.modal-close__btn').on('click', function(){
    $(this).closest('.modal').removeClass('show');
    $('.modal-overlay').removeClass('show');
    $('body').removeClass('popup-open');
  })

  $('.modal-overlay').on('click', function(){
    $('.modal').removeClass('show');
    $(this).removeClass('show');
    $('body').removeClass('popup-open');
  })


  /*Слайдер - отзывы*/

  const slides = $('.testimonials-slide');
  let currentIndex = 0;
  const total = slides.length;
  let isDragging = false;
  let startX = 0;
  let autoSlideInterval = null;
  let resizeTimer;

  function updateCarousel(index){
    slides.removeClass('center level1-left level1-right level2-left level2-right');
    slides.eq(index).addClass('center');
    
    if(total > 1){
      slides.eq((index - 1 + total) % total).addClass('level1-left');
      slides.eq((index + 1) % total).addClass('level1-right');
    }
    
    if(total >= 3){
      slides.eq((index - 2 + total) % total).addClass('level2-left');
      slides.eq((index + 2) % total).addClass('level2-right');
    }
  }

  function startAutoSlide(){
    if($(window).width() >= 1025){
      stopAutoSlide();
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % total;
        updateCarousel(currentIndex);
      }, 5000);
    }
  }

  function stopAutoSlide(){
    if(autoSlideInterval){
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }
  }

  updateCarousel(currentIndex);
  startAutoSlide();

  $('.testimonials__slider').on('mouseenter', function(){
    if ($(window).width() >= 1025) stopAutoSlide();
  })
  $('.testimonials__slider').on('mouseleave', function(){
    if ($(window).width() >= 1025) startAutoSlide();
  });

  if($(window).width() < 1025){
    $('.testimonials__slider').on('mousedown touchstart', function(e){
      isDragging = true;
      startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
    });

    $(document).on('mouseup touchend', function(e){
      if(!isDragging) return;
      const endX = e.type === 'touchend' && e.originalEvent.changedTouches
        ? e.originalEvent.changedTouches[0].clientX
        : e.clientX;
      const diff = endX - startX;

      if(diff > 50){
        currentIndex = (currentIndex - 1 + total) % total;
        updateCarousel(currentIndex);
      }
      else if(diff < -50){
        currentIndex = (currentIndex + 1) % total;
        updateCarousel(currentIndex);
      }
      isDragging = false;
    });
  }

  $(window).on('resize', function(){
    $('.testimonials__slider').addClass('no-transition');
    
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){
      if($(window).width() >= 1025){
        $('.testimonials__slider').off('mousedown touchstart');
        $(document).off('mouseup touchend');
        startAutoSlide();
      }
      else{
        stopAutoSlide();
        $('.testimonials__slider').off('mousedown touchstart');
        $(document).off('mouseup touchend');

        $('.testimonials__slider').on('mousedown touchstart', function(e){
          isDragging = true;
          startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
        });

        $(document).on('mouseup touchend', function(e){
          if(!isDragging) return;
          const endX = e.type === 'touchend' && e.originalEvent.changedTouches
            ? e.originalEvent.changedTouches[0].clientX
            : e.clientX;
          const diff = endX - startX;

          if(diff > 50){
            currentIndex = (currentIndex - 1 + total) % total;
            updateCarousel(currentIndex);
          } 
          else if(diff < -50){
            currentIndex = (currentIndex + 1) % total;
            updateCarousel(currentIndex);
          }
          isDragging = false;
        });
      }
      updateCarousel(currentIndex);
      $('.testimonials__slider').removeClass('no-transition');
    }, 100);
  });

  
  /*Аккордеон*/

  $(".faq-acc__link").on("click", function(e){
    e.preventDefault()

    if($(this).hasClass("active")){
      $(this).removeClass("active")
      $(this).children(".faq-acc__body").slideUp()
    }
    else{
      $(".faq-acc__link").removeClass("active")
      $(".faq-acc__body").slideUp()
      $(this).addClass("active")
      $(this).children(".faq-acc__body").slideDown()
    }
  })


  /*Анимация*/

  $('.animation').addClass('show');

  function getBuffer() {
    return window.innerWidth <= 768 ? 10 : 50;
  }

  function isVisible($elem){
    const rect = $elem[0].getBoundingClientRect();
    const vh = window.innerHeight;
    const buffer = getBuffer();

    return rect.top < vh - buffer && rect.bottom > buffer;
  }

   

  function isFullyOut($elem){
    const rect = $elem[0].getBoundingClientRect();
    const vh = window.innerHeight;
    const buffer = getBuffer();

    return rect.bottom < -buffer || rect.top > vh + buffer;
  }

  function hideWithoutAnimation($el){
    $el.removeClass('show');
  }
  
  function animateHeadings(){
    $('.animation-heading').each(function(){
      const $heading = $(this);

      if(isVisible($heading)){
        if(!$heading.data('shown')){
            $heading.data('shown', true);
            setTimeout(() => $heading.addClass('show'), 250); 
          }
      } 
      else if(isFullyOut($heading)){
        $heading.data('shown', false);
        hideWithoutAnimation($heading);
      }
    });
  }

  function animateButtons(){
    $('.animation-btn').each(function(){
      const $btn = $(this);

      if (isVisible($btn)){
        if (!$btn.data('shown')){
              $btn.data('shown', true);
              setTimeout(() => $btn.addClass('show'), 400);
          }
      }
      else if(isFullyOut($btn)){
        $btn.data('shown', false);
        hideWithoutAnimation($btn);
      }
    });
  }

  function animateGroups(){
    $('.animation-group').each(function(){
      const $group = $(this);

      if (isVisible($group)){
        if (!$group.data('animating')){
              $group.data('animating', true);

              setTimeout(() => {
                const $items = $group.find('.animation-item');

                $items.each(function(index) {
                  $(this)
                    .css('transition-delay', (index * 0.25) + 's')
                    .addClass('show');
                });

                const $btn = $group.closest('.services__wrapper').find('.animation-btn');
                if ($btn.length) {
                  const itemsCount = $items.length;
                  const buttonDelay = (itemsCount * 250) + 600; 

                  setTimeout(() => {
                    $btn.addClass('show');
                  }, buttonDelay);
                }
              }, 600);
            }
        }
        else if(isFullyOut($group)){
          $group.data('animating', false);

          $group.find('.animation-item')
            .removeClass('show')
            .css('transition-delay', '0s');
        }
      });
  }

  function checkAllAnimations(){
    animateHeadings();
    animateGroups();
    animateButtons();
  }

  $(window).on('scroll resize', checkAllAnimations);
  checkAllAnimations();

  
  /*Бургер*/
  
  $(".burger-btn, .overlay").on("click", function(e){
    e.preventDefault()
    $(".burger-menu").toggleClass("burger-menu--open")
    $(".overlay").toggleClass("overlay--show")
  })

  $(".burger-btn__close, .overlay, .burger-menu a").on("click", function(e){
    if (!$(this).hasClass("burger-btn")) {
      $(".burger-menu").removeClass("burger-menu--open");
      $(".overlay").removeClass("overlay--show");
    }
  })

})


      