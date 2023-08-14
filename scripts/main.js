$(function () {


    $(window).resize(function () {
        let sliders = $(".slider");
        $.each(sliders , function(){
            let sliderWidth = $(this).innerWidth();
            let currentSlide = parseInt($(this).attr("data-currentSlide"));
            $(this).find(".slide:first-child").css("margin-right", -(currentSlide * sliderWidth) + "px")
        });
    });
    
    function next(slider){
      let currentSlide = parseInt($(slider).attr("data-currentSlide"));
      let slidesCount = parseInt($(slider).find(".slide").length);
      let slides = $(slider).find(".slide");
  
      if (currentSlide + 1 < slidesCount) {
        let sliderWidth = $(slider).innerWidth();
  
        $(slides[0]).animate({ marginRight: "+=" + -sliderWidth + "px" },500,function () {
            currentSlide++;
            $(slider).attr("data-currentSlide", currentSlide);
            let dots = $(slider).find(".dot");
            $(dots).removeClass("active-dot");
            $(dots[currentSlide]).addClass("active-dot");
          });
      }
      else{
        $(slides[0]).animate({ marginRight: "0px" },500,function () {
          currentSlide = 0;
          $(slider).attr("data-currentSlide", currentSlide);
          let dots = $(slider).find(".dot");
          $(dots).removeClass("active-dot");
          $(dots[currentSlide]).addClass("active-dot");
        });
      }
    }

    function prev(slider){
      let currentSlide = parseInt($(slider).attr("data-currentSlide"));
      let slides = $(slider).find(".slide");
      let sliderWidth = $(slider).innerWidth();

      if (currentSlide - 1 >= 0) {
  
        $(slides[0]).animate({ marginRight: "+=" + sliderWidth + "px" },500,function () {
            currentSlide--;
            $(slider).attr("data-currentSlide", currentSlide);
            let dots = $(slider).find(".dot");
            $(dots).removeClass("active-dot");
            $(dots[currentSlide]).addClass("active-dot");
          });
      }
      else{
        let slidesLength = $(slider).find(".slide").length;
        $(slides[0]).animate({ marginRight: -((slidesLength -1) * sliderWidth) + "px" },500,function () {
          currentSlide = slidesLength - 1;
          $(slider).attr("data-currentSlide", currentSlide);
          let dots = $(slider).find(".dot");
          $(dots).removeClass("active-dot");
          $(dots[currentSlide]).addClass("active-dot");
        });
      }
    }

    function autoNext(){
      let sliders = $(".slider");
      $.each(sliders , function(){
        next(this);
      });
    }
    let autoNextVal = setInterval(autoNext , 3000);

    $(".next").click(function () {
      next($(this).parents(".slider"));
      clearInterval(autoNextVal);
      autoNextVal = setInterval(autoNext , 3000);
    });
    
    $(".prev").click(function () {
      prev($(this).parents(".slider"));
      clearInterval(autoNextVal);
      autoNextVal = setInterval(autoNext , 3000);
    });

    $(".dot").click(function(){
        let slideIndex = parseInt($(this).attr("data-targetSlide"));
        let sliderWidth = $(this).parents(".slider").innerWidth();
        let slides = $(this).parents(".slider").find(".slide");
        let margin = (slideIndex * (sliderWidth));

        $(this).siblings(".dot").removeClass("active-dot")
        $(this).addClass("active-dot");
        $(slides[0]).animate({ marginRight: -margin + "px" },500,function () {
            $(this).parents(".slider").attr("data-currentSlide", slideIndex);
        });
        clearInterval(autoNextVal);
        autoNextVal = setInterval(autoNext , 3000);
    });

  });
  