$(document).ready(function () {
    const MENU_OPEN_CLASS = 'menu-open';
    const SCROLL_LOCK_CLASS = 'scroll-lock';
    let $baseLinkItems = $(".header-navigation__item");
    let headerHeight = $('.header-with-top-banner').outerHeight() ? $('.header-with-top-banner').outerHeight() + 'px' : '';

    /**
     * Function called on click of hamburger menu
     */
    function _toggleHamburger() {
        $('html').toggleClass(SCROLL_LOCK_CLASS);
        $('body').toggleClass(MENU_OPEN_CLASS);
    }

    /**
     * Function called on click of menu items with secondary menu
     */
    function _toggleSubmenu(e) {
        e.stopPropagation();
        var $currentMenu = $(this);
        var $subMenuGroup = $currentMenu.find('.header-navigation__secondary');
        $baseLinkItems.not($currentMenu).removeClass("active-submenu");
        $baseLinkItems.not($currentMenu).find('.header-navigation__secondary').slideUp();

        if ($subMenuGroup.length) {
            $currentMenu.toggleClass("active-submenu");
            if (window.matchMedia("(max-width:1250px)").matches) {
                $subMenuGroup.slideToggle();
            }
        }

    }

    /**
     * Function called on keypress on expand/collapse icon for keyboard accesibility
     * @param {Object} e   event object 
     */
    function _keyToggleHandler(e) {
        e.stopPropagation();
        var keycode = (e.keyCode ? e.keyCode : e.which);
        if (keycode === 13) {
            $(this).closest('.header-navigation__item').first().trigger('click');
        }
    }

    /**
     * Header initialization and binding header events
     */
    function _init() {
        $('.toggle-menu').on('click', _toggleHamburger);
        $baseLinkItems.on('click', _toggleSubmenu).find('.plus').on('keypress', _keyToggleHandler);
        var mainContent = document.getElementsByClassName("main-content")[0];
        if(mainContent) {
        mainContent.setAttribute("id", "mainContent");
        mainContent.setAttribute("tabindex", "0");
        }

        headerHeight ? $('.g2b-header__nav').css('top', headerHeight) : "";
        headerHeight ? $('.g2b-header__menu-background').css('top', headerHeight) : "";
        headerHeight ? $('.header+div').css('padding-top', headerHeight) : "";
        $(document).on('click', function () { $baseLinkItems.removeClass("active-submenu"); });


        // Adding a class on menu link if it has dropdown
        $baseLinkItems.each(function (index, item) {
            if ($(item).find('.header-navigation__secondary').length > 0) {
                $(item).addClass("active-hover no-cursor");
            }
        });
    }

    _init();
});


$(window).on('load', function () {

})
$(document).ready(function() {

    function _createVideoAPIElement(){
        var youtube_Script = '<script src="https://www.youtube.com/iframe_api" defer ></script>';
        var vimeo_Script = '<script src="https://player.vimeo.com/api/player.js" defer ></script>';

        if ($('script[src="https://www.youtube.com/iframe_api"]').length == 0) {
                //script exists
                $('body').append(youtube_Script);
        }

        if ($('script[src="https://player.vimeo.com/api/player.js"]').length == 0) {
                //script exists
                $('body').append(vimeo_Script);
        }
    }

    // function called on each window scroll
    function _lazyLoadScrollHandler() {
        let $lazyLoadVideos = $('.js-lazyvideo'),
            $videoIframe = '';

        $lazyLoadVideos.each(function(item){ 

            //if video is in viewport, add src to the iframe
            if(GDOT.utilities.isInViewport($(this))) {
                $videoIframe = $(this).find('iframe');
                $videoIframe.attr('src', $videoIframe.data('src'));
                $(this).removeClass('js-lazyvideo');
            }               
        });

        //unbind the scroll event if no more lazy load videos left
        if(!$lazyLoadVideos.length) {
			$(window).unbind('scroll',_lazyLoadScrollHandler);
        }
    }

    function _pauseVideo() {
        let $videoPlayer = $(this).parents('.modal-component').find('.video-vimeo, .video-youtube');
        if($videoPlayer.length) {
            if($videoPlayer.hasClass('video-vimeo')) {
                let player =  new Vimeo.Player($($videoPlayer));
                player.pause();
            } else {
                $videoPlayer[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            }
        }
    }

    $(window).on('scroll', _lazyLoadScrollHandler);
    $('.js-modal-close').on('click', _pauseVideo);
    if($("body").find("iframe[src*='youtube.com']").length !== 0 || $("body").find("iframe[src*='vimeo.com']").length !== 0){
        _createVideoAPIElement();
    }
    
});

(function (){
  const verticalSliderInit = () => {
    if (window.innerWidth <= 550) {
      if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
        const slider = $(".scroll-slides");
        slider
          .slick({
            infinite: true,
            dots: true,
            speed: 300,
            variableWidth: true,
            arrows: false,
            swipe: true,
            touchMove: true,
            accessibility: true,
  
            slidesToShow: 1,
            slidesToScroll: 1
          });
  
        slider.on('wheel', (function (e) {
          e.preventDefault();
  
          if (e.originalEvent.deltaY < 0) {
            $(this).slick('slickPrev');
          } else {
            $(this).slick('slickNext');
          }
        }));
      }
    }
    else {
  
      // debounce from underscore.js
      function debounce(func, wait, immediate) {
        var timeout;
        return function () {
          var context = this, args = arguments;
          var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      };
  
      // use x and y mousewheel event data to navigate flickity
      function slick_handle_wheel_event(e, slick_instance, slick_is_animating) {
        // do not trigger a slide change if another is being animated
        if (!slick_is_animating) {
          // pick the larger of the two delta magnitudes (x or y) to determine nav direction
          var direction =
            Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;  
          if (direction > 0) {
            // next slide
            slick_instance.slick("slickNext");
          } else {
            // prev slide
            slick_instance.slick("slickPrev");
          }
        }
      }
  
      // debounce the wheel event handling since trackpads can have a lot of inertia
      var slick_handle_wheel_event_debounced = debounce(
        slick_handle_wheel_event
        , 100, true
      );
  
      // init slider 
      const slick_2 = $(".scroll-slides");
      slick_2.slick({
        dots: true,
        vertical: true,
        // verticalSwiping: true,
        arrows: false,
        accessibility: true,
        infinite: false
      });
      var slick_2_is_animating = false;
  
      slick_2.on("afterChange", function (index) {
        slick_2_is_animating = false;
      });
  
      slick_2.on("beforeChange", function (index) {
        slick_2_is_animating = true;
      });
  
      slick_2.on("wheel", function (e) {
        e.preventDefault();
        slick_handle_wheel_event_debounced(e.originalEvent, slick_2, slick_2_is_animating);
      });
  
  
    }
  }
  
  $(document).ready(function () {
    verticalSliderInit();
  
  });

  if (window.adobe) {
    if(window.adobe.target){
        document.addEventListener('at-content-rendering-succeeded', function (event) {
          verticalSliderInit();
        });
    }
    
  }

})();
  
  
  
  
  
  
  
$(window).on("load", function() {
    let $ujetComp = $(".ujet-config");
    let _ujetConfigs = {};

    /**
     * Generate a pseudo-random id to serve as an element's id
     */
    function _getNewRandomId() {
        let id = "";
        while (!id || document.getElementById(id) != null) {
            id = "ujet-initializer-" + Math.floor(Math.random() * 100000);
        }
        return id;
    }

    /**
     * Function to get the id of the selector/s authored. On click of selector, chatbot pops up
     */
    function _getSelectorIds() {
        var elementIdsToAttachTo = [];
        if (_ujetConfigs.selectors && _ujetConfigs.selectors.length) {
            _ujetConfigs.selectors.forEach(function(selector) {
                // check if the element has an id
                let id = $(selector).attr("id");

                // if no id is present, generate a new one
                if (!id) {
                    id = _getNewRandomId();
                    $(selector).attr("id", id);
                }

                // add the element's id to the list of elements to attach to
                elementIdsToAttachTo.push(id);
            });
        }
        return elementIdsToAttachTo;
    }

    /**
     * Initialize ujet object once scripts are loaded
     */
    function _afterScriptsloaded() {
        if (typeof ujetInitializationObject === "undefined") {
            console.warn(
                "Unable to load UJET script, ujetInitializationObject is not defined"
            );
            return;
        }
        const ujetObject = new ujetInitializationObject(_ujetConfigs.site, false);
        ujetObject.hideWidget = _ujetConfigs.hideWidget;
        ujetObject.addLoggingBeforeUjetLoad =
            _ujetConfigs.addLoggingBeforeUjetLoad;
        ujetObject.hideLauncher = _ujetConfigs.hideLauncher;
        ujetObject.isQA = _ujetConfigs.useQA;
        if (_ujetConfigs.linkOverride && _ujetConfigs.linkOverride.length) {
            ujetObject.overrideMethodForContactUs = function() {
                window.location = _ujetConfigs.linkOverride;
            };
        }

        // resolve selectors to elements
        ujetObject.elementIdsToAttachTo = _getSelectorIds();

        initializeUjet(ujetObject);
    }

    /**
     * Function to load ujet scripts if ujet is enabled and scripts are provided
     */
    function _loadScript() {
        if (_ujetConfigs.enabled && _ujetConfigs.src) {
            if (_ujetConfigs.webSdkSrc && _ujetConfigs.webSdkSrc.length) {
                GDOT.utilities.loadScript(_ujetConfigs.webSdkSrc);
            }
            GDOT.utilities.loadScript(_ujetConfigs.src, _afterScriptsloaded);
        }
    }

    /**
     * Function called on each window scroll
     */
    function _lazyLoadUjetHandler() {
        //add ujet scripts if the viewport selector is in view
        if (GDOT.utilities.isInViewport($(_ujetConfigs.viewPortSelector))) {
            $(window).unbind("scroll", _lazyLoadUjetHandler);
            _loadScript();
        }
    }

    /**
     * Function called on user activity
     */
    function _onUserActive() {
        $(document).unbind('mousemove mousedown keydown scroll touchstart', _onUserActive);
        _loadScript();
    }

    /**
     * Initialization function
     */
    function _init() {
        if ($ujetComp.length) {
            _ujetConfigs = {
                src: $ujetComp.data("ujet-script-src"),
                webSdkSrc: $ujetComp.data("ujet-sdk-src"),
                enabled: $ujetComp.data("ujet-enabled"),
                enableLazyLoading: $ujetComp.data("ujet-enable-lazy-loading"),
                useQA: $ujetComp.data("ujet-use-qa"),
                viewPortSelector: $ujetComp.data("ujet-view-port-selector"),
                site: $ujetComp.data("ujet-site"),
                selectors: $ujetComp.data("ujet-selector"),
                hideWidget: $ujetComp.data("ujet-hide-widget"),
                addLoggingBeforeUjetLoad: $ujetComp.data("ujet-add-logging-before-ujet-load"),
                hideLauncher: $ujetComp.data("ujet-hide-launcher"),
                linkOverride: $ujetComp.data("ujet-link-override")
            };

            if (_ujetConfigs.enableLazyLoading && _ujetConfigs.viewPortSelector) {
                $(window).on("scroll", _lazyLoadUjetHandler);
            } else {
                $(document).on('mousemove mousedown keydown scroll touchstart', _onUserActive);
            }
        }
    }

    _init();
});
$(document).ready(function() {
    var $body = $('body');
    var $bannerCookieData = $('#banner-cookie');
    var $banner = $('#topBanner');
    var name = $bannerCookieData.data("name");
    var duration = $bannerCookieData.data("duration");
    var getCookieAccept = getCookie("cookiepolicy");

    if (name && duration) {
        getCookieAccept === name ? $banner.hide() : $banner.show();
    } else {
        $banner.show();
    }

    $body.on('click', '#banner-close', function(){
		$(this).parent($banner).hide();
        
        var expire = new Date();
        //Setting cookie expiry after defined days 
        expire = new Date(expire.getTime() + duration * 86400);
        document.cookie = "cookiepolicy=" + name + "; expires=" + expire;
    });

    if($(".show-top-banner").length) {
        $('.brand-logo').closest('.aem-Grid').addClass('position-relative');
    }
});

function getCookie(name) {

    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
$(document).ready(function () {
    let $footnoteLinks = $('.footnote_link');
    let headerHeight = $('.g2b-header').outerHeight();
    let hasTouch = false;
    let hasMouse = false;
    const $modal = $('#custom-common-modal.tool-tip-modal');
    /**
     * Function to invert the tooltip depending on the space available
     * @param {Object} $elm Jquery object for the target element 
     * @param {Number} tooltipTextHeight Height of the tooltiptext
     */
    function _invertTooltip($elm, tooltipTextHeight) {
        if ($elm.offset().top - $(window).scrollTop() - headerHeight < tooltipTextHeight + 30) {
            $elm.addClass('invert');
        } else {
            $elm.removeClass('invert');
        }
    }
    function hideToolTipModal() {
        $modal.hide();
    }
    function showToolTipModal() {
        $modal.show();
        $('body').css({ 'overflow': 'hidden' });
    }
    /**
     * Function called on hover in and click for all viewports
     */
    function _tooltipHoverHandler() {
        if (!($('body').hasClass('touch-enabled'))) {
            hideToolTipModal();
            let $elm = $(this);
            $(this).closest(".slider-table__row").addClass("secondary-z-index");
            $elm.closest('.gd-content-card').addClass('overflow-visible');
            $elm.closest('.gd-table__container').addClass('overflow-visible');
            $elm.closest('.slider-table__fixed-column').addClass('secondary-z-index');

            let modalContent = getTooltipContent($elm);
            if (!($elm.find('.footnotes_tooltiptext').length)) {
                $elm.append(`<div class='footnotes_tooltiptext'>${modalContent}</div>`);
            } else {
                $elm.closest('.footnotes_tooltiptext').show();
            }
            if (!$elm.closest('.footnote_link').hasClass('show-tooltip')) {
                _invertTooltip($elm, $elm.find('.footnotes_tooltiptext')[0].getBoundingClientRect().height);
            }
        }
    }

    /**
     * Function called on hover out
     */
    function _tooltipHoverOutHandler() {
        let $elm = $(this);
        $(this).closest(".slider-table__row").removeClass("secondary-z-index");
        $elm.closest('.gd-content-card').removeClass('overflow-visible');
        $elm.closest('.gd-table__container').removeClass('overflow-visible');
        $('.slider-table__fixed-column').removeClass('secondary-z-index');
        $footnoteLinks.removeClass('show-tooltip');
    }

    /**
     * Function called on click of tooltip to display and position tooltip for mobile
     * @param {Object} e  event object passed to function on call
     */
    function checkUserAgent() {
        const ua = window.navigator.userAgent;
        if (/Android/i.test(ua)) {
            $('body').addClass('android-device');
        }
    }
    function _tooltipClickHandler(e) {
        if ($('body').hasClass('touch-enabled')) {
            let $el = $(this);
            let $parent = $el.closest('.footnote_link');
            let modalContent = getTooltipContent($el);
            $(`.tool-tip-modal__text`).html(modalContent);
            showToolTipModal();
            if ($parent.hasClass('show-tooltip')) {
                $footnoteLinks.removeClass('show-tooltip');
            } else if (window.innerWidth < 1144 || window.orientation === 90) {
                $parent.addClass('show-tooltip');
            }
            if ($('body').hasClass('android-device')) {
                $('.tool-tip-modal').css({ top: '-22px' });
            }
        }
    }
    $('.tool-tip-modal__close').on('click', function () {
        closeModal();

    });
    function closeModal() {
        hideToolTipModal();
        $('body').css({ 'overflow': 'scroll' });
    }
    function getTooltipContent($elm) {
        const elementId = $elm.attr('id');
        const modalContent = $(`.tool-tip-content[data-id=${elementId}]`).html();
        return modalContent;
    }
    /**
     * Initial function for binding tooltip events on page load
     */
    function _initTooltip() {
        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
            hasTouch = true;
        }
        else {
            hasMouse = true
        }
        if (hasTouch && !hasMouse) {
            $('body').addClass('touch-enabled');
            checkUserAgent();
        }
        $('body').on('mouseenter touchstart', '.footnote_link.footnotes_tooltip', _tooltipHoverHandler).on('mouseleave', '.footnote_link.footnotes_tooltip', _tooltipHoverOutHandler).on('click', '.footnote_link.footnotes_tooltip', _tooltipClickHandler);
        hideToolTipModal();
    }

    _initTooltip();

    var $win = $(window);
    $("a[data-modal-id='video_vimeo']").on('click', function () {
        var currentScrollPos = $win.scrollTop();

        if (currentScrollPos === 0) {
            $win.scrollTop(currentScrollPos + 1);
        } else {
            $win.scrollTop(currentScrollPos - 1);
        }

    })

});
(function (){

    function tabComponentInit () {

        let hash = location.hash;
        let $tabToShow = $(`.cmp-tabs__tab${hash}`);
        let $accordionToShow = $(`#${$tabToShow.attr('aria-controls')}`).find('.cmp-accordion__button');
        let headerHeight = $('.g2b-header').outerHeight();
        let scrollHeight = 0;


        if (window.innerWidth > 1023) {
            $('.cmp-tabs__tabpanel').attr('aria-hidden', 'true');
            $('.cmp-tabs__tabpanel--active').removeAttr('aria-hidden');
            $('.cmp-tabs__tabpanel .cmp-accordion__panel').removeAttr('aria-hidden');
        } else {
            $('.cmp-tabs__tabpanel').removeAttr('aria-hidden');
            $('.cmp-tabs__tabpanel .cmp-accordion__panel').attr('aria-hidden', 'true');
            $('.cmp-tabs__tabpanel .cmp-accordion__panel--expanded').attr('aria-hidden', 'false');
        }

        //scroll to the tab(for desktop) or accordion(for mobile) after page visible
        if (hash.length && $tabToShow.length) {
            $('.cmp-tabs__tab').removeClass('cmp-tabs__tab--active');
            setTimeout(() => {
                if ($('.cmp-tabs__tablist').is(':visible')) {
                    $tabToShow.trigger('click');
                    scrollHeight = $tabToShow.offset().top;
                } else {
                    $accordionToShow.trigger('click');
                    scrollHeight = $accordionToShow.offset().top;
                }

                $('html, body').animate({
                    scrollTop: scrollHeight - headerHeight
                }, 500);
            }, 2000);
        }
    }


    $(document).ready(function() {
        tabComponentInit();
    });
    
    if (window?.adobe?.target) {
    document.addEventListener('at-content-rendering-succeeded', function (event) {
        tabComponentInit();
    });
    }
})();
$(document).ready(function() {
  var helpPage = "/for-people/help";
  var $container = $('#search-results-content');
  $container.find('.search-result-block').each(function() {
    
  });
});
$(document).ready(function() {
    let sliderInitiated = false,
        topBound = 0,
        lastScrollTop = $(window).scrollTop(),
        bottomBound = 0;
    let $parallax = $('.parallax');
    let $sliderFor = $('#parallaxOne');
    let $sliderNav = $('#parallaxTwo');
    let noOfSlides = $sliderFor.find('.parallax__img').length;

    /**
     * Initiate slider for desktop browsers
     */
    function _initSlider() {
        $sliderFor.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '#parallaxTwo',
            vertical: true,
            infinite: false,
            arrows: false,
            speed: 0,
            useCSS: false,
            responsive: [{
                breakpoint: 1000,
                settings: "unslick"
            }]
        });
        $sliderNav.slick({
            slidesToShow: noOfSlides,
            slidesToScroll: 1,
            asNavFor: '#parallaxOne',
            dots: true,
            vertical: true,
            infinite: false,
            focusOnSelect: true,
            arrows: false,
            responsive: [{
                breakpoint: 1000,
                settings: "unslick"
            }]
        });


    }

    /**
     * Funtion called on scrolling over the parallax component
     * @param {Number} st current view scrollTop value
     * @param {Number} lastScrollTop previous view scrollTop value
     */
    function _sliderHandler(st, lastScrollTop) {
        let currentIndex = $sliderFor.slick('slickCurrentSlide');
        if (st > lastScrollTop) {
            if ((window.pageYOffset - topBound) >= (window.innerHeight * ++currentIndex)) {
                $sliderFor.slick('slickNext');
            }
        } else if ((bottomBound - window.pageYOffset - window.innerHeight + 200) >= (window.innerHeight * (noOfSlides - currentIndex))) {
            $sliderFor.slick('slickPrev');
        }
    }

    /**
     * Function called on page scroll to check if parallax component is in viewport and slide accordingly
     */
    function _parallaxHandler() {
        var st = $(this).scrollTop();

        if (GDOT.utilities.isInViewport($parallax)) {
            if (sliderInitiated) {
                _sliderHandler(st, lastScrollTop);
            } else {
                sliderInitiated = true;
                if (st < lastScrollTop) {
                    $sliderFor.slick('slickGoTo', noOfSlides - 1);
                }
            }

            lastScrollTop = st;
        }
    }

    /**
     * Function to adjust the scroll length
     */
    function _scrollHeightHandler() {
        if (window.innerWidth > 768) {
            $parallax.css('height', ((noOfSlides + 1) * 100) + 'vh');
        } else {
            $parallax.css('height', 'auto');
        }

        topBound = $parallax.offset().top;
        bottomBound = topBound + $parallax.height();
    }

    /**
     * Initiate the slider for above 767px width device and not for internet explorer
     */
    if ($parallax.length && (window.innerWidth > 767)) {
        if (GDOT.utilities.isInternetExplorer()) {
            $parallax.addClass('parallax-ie');
        } else {
            _initSlider();
            _scrollHeightHandler();
            $(window).on("scroll", _parallaxHandler);
            $(window).on("orientationchange", _scrollHeightHandler);
        }
    }
});
$(document).ready(function() {
    const $modal = $('.modal');

    /**
     * Function to close modal
     */
    function closeModal() {
        $modal.removeClass('modal--open modal--visible');
        $('body').css({ 'overflow': 'scroll' });
    }

    /**
     * function to show modal specific to the modal id of button clicked
     * @param {Object} $btnCLicked  jquery object
     */
    function showModal($btnCLicked) {
        let modalId = '#' + $btnCLicked.data('modal-id');
        $(modalId).addClass('modal--open modal--visible');
        $('body').css({ 'overflow': 'hidden' });
    }

    function _initModals() {
        $('body').on('click', '.js-open-modal', function() {
            showModal($(this));
        });

        $('body').on('click', '.js-modal-close', function() {
            closeModal();
        });
    }

    _initModals()
});
//js code
$(document).ready(function() {
    let $contactUsForm = $("#contactus");
    let contactUsSrc = $contactUsForm.attr('src');
    $contactUsForm.attr('src', contactUsSrc+location.search);
});

const contentSliderInit = () => {
  $('.content-slider-wrapper').not('.slick-initialized').slick({
    slidesToShow: 3,
    slidesToScroll: 3,
    arrows: true,
    dots: false,
    speed: 300,
    infinite: false,
    accessibility: true,
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          swipe: true,
          touchMove: true,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          swipe: true,
          touchMove: true,
        }
      }
    ]
  });
}

$(document).ready(function () {
  contentSliderInit();

});

if (window.adobe) {
  if(window.adobe.target){
      document.addEventListener('at-content-rendering-succeeded', function (event) {
        contentSliderInit();
      });
  }
  
}









//JS placeholder
$(document).ready(function() {
    let $sliderTable = $('.slider-table');
    let _cache = {
        columnCount: $sliderTable.find('.slider-table__row:eq(0) .slider-table__row-cell').length,
        $tableTooltips: $sliderTable.find('.js-help-link'),
        $headRow: $sliderTable.find('.slider-table__head .slider-table__row'),
        $bodyRow: $sliderTable.find('.slider-table__body:not(".slider-table__head") .slider-table__row'),
        $firstColumn: $sliderTable.find('.slider-table__fixed-column'),
        left: 0,
        slideWidth: 0
    };

    _cache.slidesToShow = _cache.columnCount > 4 ? 5 : _cache.columnCount;

    /**
     * Function to fix heading first column for desktop view
     */
    function _fixFirstColumn() {
        let $cell = '',
            $firstCell = '';
        _cache.$firstColumn.each(function() {
            $cell = $(this);
            $firstCell = $(this).closest('.comparison-table-row').find('.slider-table__row-cell:eq(0)');
            $cell.css('width', $firstCell.css('width'));
            $cell.css('height', $firstCell.css('height'));
        });
    }

    /**
     * Function called on window resize to rebuilt the table UI
     */
    function _windowResizeHandler() {
        if (window.innerWidth < 1110) {
            _cache.$firstColumn.css('width', 'auto');
            _updateColPosition();
        } else if (_cache.columnCount > 4) {
            _fixFirstColumn()
        }
    }

    /**
     * Function called on click of tooltip inside table
     */
    function _tableTooltipHandler() {
        $(this).closest('.slick-list').toggleClass('overflow-visible');
    }

    /**
     * Function called to update the fix column position on arrow click and swipe
     */
    function _updateColPosition() {
        let prop = $('.slider-table__head .slick-track').css('transform');
        let arr = JSON.parse("[" + prop.substr(7, prop.length - 8) + "]");
        _cache.left = arr[4];
        $('.fix-column').css('left', -_cache.left);
    }

    /**
     * function called on slider arrow click and swipe
     */
    function _onSwipeOrClick() {
        if (_cache.$slides.hasClass('fix-column')) {
            _updateColPosition();
        }
    }

    /**
     * function called on head cell click to make the corresponding column fixed
     */
    function _onColumnClick() {
        _cache.left = 0;
        let $headColumn = $(this);
        _cache.rightEnd = 0;
        if ($headColumn.hasClass('fix-column')) {
            _cache.$headRow.slick('slickSetOption', 'speed', 300, false);
            _cache.$bodyRow.slick('slickSetOption', 'speed', 300, false);
            _cache.$slides.removeClass('fix-column');
            _cache.$headRow.removeClass('update-arrow');
        } else {
            _cache.$slides.removeClass('fix-column');
            let slideIndex = $headColumn.attr('data-slick-index');
            _cache.$headRow.slick('slickSetOption', 'speed', 0, false);
            _cache.$bodyRow.slick('slickSetOption', 'speed', 0, false);
            _cache.$headRow.slick('slickGoTo', 0);
            _cache.$bodyRow.slick('slickGoTo', 0);
            $('.slick-slide[data-slick-index="' + slideIndex + '"]').addClass('fix-column');
            _cache.$headRow.addClass('update-arrow');
            _updateColPosition();
        }
    }

    /**
     * function to initialize all the head and body rows slider or the table
     */
    function _initSlick() {
        _cache.$headRow.slick({
            slidesToShow: _cache.slidesToShow,
            slidesToScroll: 1,
            asNavFor: '.slider-nav',
            infinite: false,
            responsive: [{
                    breakpoint: 1110,
                    settings: {
                        slidesToShow: _cache.slidesToShow < 3 ? _cache.slidesToShow : 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });

        _cache.$bodyRow.slick({
            slidesToShow: _cache.slidesToShow,
            slidesToScroll: 1,
            asNavFor: '.slider-nav',
            arrows: false,
            infinite: false,
            responsive: [{
                    breakpoint: 1110,
                    settings: {
                        slidesToShow: _cache.slidesToShow < 3 ? _cache.slidesToShow : 3
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });

        _cache.$slides = $sliderTable.find('.slick-slide');
    }

    function _init() {
        _initSlick();

        if (window.innerWidth < 1110) {
            $('.slider-nav').slick('slickRemove', 0);
            $('.slider-table__tab-enabled .slider-table__head .slick-slide').on('click', _onColumnClick);
            $('.slick-arrow').on('click', _onSwipeOrClick);
            _cache.$headRow.on('swipe', _onSwipeOrClick);
            _cache.$bodyRow.on('swipe', _onSwipeOrClick);
            _cache.$headRow.on('setPosition', function() {
                _windowResizeHandler();
            });
        } else {
            _cache.$firstColumn.addClass('column-fixed');
            _fixFirstColumn();
            $(window).on('resize orientationchange', _windowResizeHandler);
        }

        _cache.$tableTooltips.on('mouseenter mouseleave touchstart focus click', _tableTooltipHandler);
    }

    _init();
})
$(document).ready(function(){
var socialShareLink = $('.share-icon');
const features=`menubar=yes,location=yes,resizable=yes,scrollbars=yes,width=500,height=500`;
function openWindow (url){
 window.open(url,'targetWindow',features )
}
 socialShareLink.on('click',function(){
     var href = $(this).attr("data-url");
     openWindow(href);
 })
})
/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2018 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
/* global
    CQ
 */
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Tabs: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;

    var NS = "cmp";
    var IS = "tabs";

    var keyCodes = {
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]',
        active: {
            tab: "cmp-tabs__tab--active",
            tabpanel: "cmp-tabs__tabpanel--active"
        }
    };

    /**
     * Tabs Configuration
     *
     * @typedef {Object} TabsConfig Represents a Tabs configuration
     * @property {HTMLElement} element The HTMLElement representing the Tabs
     * @property {Object} options The Tabs options
     */

    /**
     * Tabs
     *
     * @class Tabs
     * @classdesc An interactive Tabs component for navigating a list of tabs
     * @param {TabsConfig} config The Tabs configuration
     */
    function Tabs(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Tabs
         *
         * @private
         * @param {TabsConfig} config The Tabs configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            cacheElements(config.element);
            that._active = getActiveIndex(that._elements["tab"]);

            if (that._elements.tabpanel) {
                refreshActive();
                bindEvents();
            }

            // Show the tab based on deep-link-id if it matches with any existing tab item id
            if (containerUtils) {
                var deepLinkItemIdx = containerUtils.getDeepLinkItemIdx(that, "tab");
                if (deepLinkItemIdx && deepLinkItemIdx !== -1) {
                    var deepLinkItem = that._elements["tab"][deepLinkItemIdx];
                    if (deepLinkItem && that._elements["tab"][that._active].id !== deepLinkItem.id) {
                        navigateAndFocusTab(deepLinkItemIdx);
                    }
                }
            }

            if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                /*
                 * Editor message handling:
                 * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                 * - check that the message data panel container type is correct and that the id (path) matches this specific Tabs component
                 * - if so, route the "navigate" operation to enact a navigation of the Tabs based on index data
                 */
                CQ.CoreComponents.MESSAGE_CHANNEL = CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                    if (message.data && message.data.type === "cmp-tabs" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                        if (message.data.operation === "navigate") {
                            navigate(message.data.index);
                        }
                    }
                });
            }
        }

        /**
         * Returns the index of the active tab, if no tab is active returns 0
         *
         * @param {Array} tabs Tab elements
         * @returns {Number} Index of the active tab, 0 if none is active
         */
        function getActiveIndex(tabs) {
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    if (tabs[i].classList.contains(selectors.active.tab)) {
                        return i;
                    }
                }
            }
            return 0;
        }

        /**
         * Caches the Tabs elements as defined via the {@code data-tabs-hook="ELEMENT_NAME"} markup API
         *
         * @private
         * @param {HTMLElement} wrapper The Tabs wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own tab elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Binds Tabs event handling
         *
         * @private
         */
        function bindEvents() {
            var tabs = that._elements["tab"];
            if (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    (function(index) {
                        tabs[i].addEventListener("click", function(event) {
                            navigateAndFocusTab(index);
                        });
                        tabs[i].addEventListener("keydown", function(event) {
                            onKeyDown(event);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles tab keydown events
         *
         * @private
         * @param {Object} event The keydown event
         */
        function onKeyDown(event) {
            var index = that._active;
            var lastIndex = that._elements["tab"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        navigateAndFocusTab(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        navigateAndFocusTab(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    navigateAndFocusTab(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    navigateAndFocusTab(lastIndex);
                    break;
                default:
                    return;
            }
        }

        /**
         * Refreshes the tab markup based on the current {@code Tabs#_active} index
         *
         * @private
         */
        function refreshActive() {
            var tabpanels = that._elements["tabpanel"];
            var tabs = that._elements["tab"];

            if (tabpanels) {
                if (Array.isArray(tabpanels)) {
                    for (var i = 0; i < tabpanels.length; i++) {
                        if (i === parseInt(that._active)) {
                            tabpanels[i].classList.add(selectors.active.tabpanel);
                            tabpanels[i].removeAttribute("aria-hidden");
                            tabs[i].classList.add(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", true);
                            tabs[i].setAttribute("tabindex", "0");
                        } else {
                            tabpanels[i].classList.remove(selectors.active.tabpanel);
                            tabpanels[i].setAttribute("aria-hidden", true);
                            tabs[i].classList.remove(selectors.active.tab);
                            tabs[i].setAttribute("aria-selected", false);
                            tabs[i].setAttribute("tabindex", "-1");
                        }
                    }
                } else {
                    // only one tab
                    tabpanels.classList.add(selectors.active.tabpanel);
                    tabs.classList.add(selectors.active.tab);
                }
            }
        }

        /**
         * Focuses the element and prevents scrolling the element into view
         *
         * @param {HTMLElement} element Element to focus
         */
        function focusWithoutScroll(element) {
            var x = window.scrollX || window.pageXOffset;
            var y = window.scrollY || window.pageYOffset;
            element.focus();
            window.scrollTo(x, y);
        }

        /**
         * Navigates to the tab at the provided index
         *
         * @private
         * @param {Number} index The index of the tab to navigate to
         */
        function navigate(index) {
            that._active = index;
            refreshActive();
        }

        /**
         * Navigates to the item at the provided index and ensures the active tab gains focus
         *
         * @private
         * @param {Number} index The index of the item to navigate to
         */
        function navigateAndFocusTab(index) {
            var exActive = that._active;
            navigate(index);
            focusWithoutScroll(that._elements["tab"][index]);

            if (dataLayerEnabled) {

                var activeItem = getDataLayerId(that._elements.tabpanel[index]);
                var exActiveItem = getDataLayerId(that._elements.tabpanel[exActive]);

                dataLayer.push({
                    event: "cmp:show",
                    eventInfo: {
                        path: "component." + activeItem
                    }
                });

                dataLayer.push({
                    event: "cmp:hide",
                    eventInfo: {
                        path: "component." + exActiveItem
                    }
                });

                var tabsId = that._elements.self.id;
                var uploadPayload = { component: {} };
                uploadPayload.component[tabsId] = { shownItems: [activeItem] };

                var removePayload = { component: {} };
                removePayload.component[tabsId] = { shownItems: undefined };

                dataLayer.push(removePayload);
                dataLayer.push(uploadPayload);
            }
        }
    }

    /**
     * Scrolls the browser when the URI fragment is changed to the item of the container Tab component that corresponds to the deep link in the URI fragment,
       and displays its content.
     */
    function onHashChange() {
        if (location.hash && location.hash !== "#") {
            var anchorLocation = decodeURIComponent(location.hash);
            var anchorElement = document.querySelector(anchorLocation);
            if (anchorElement && anchorElement.classList.contains("cmp-tabs__tab") && !anchorElement.classList.contains("cmp-tabs__tab--active")) {
                anchorElement.click();
            }
        }
    }

    /**
     * Reads options data from the Tabs wrapper element, defined via {@code data-cmp-*} data attributes
     *
     * @private
     * @param {HTMLElement} element The Tabs element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Tabs components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Tabs({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Tabs({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }
    window.addEventListener("hashchange", onHashChange, false);

}());

/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

/**
 * Element.matches()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/matches#Polyfill
 */
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

// eslint-disable-next-line valid-jsdoc
/**
 * Element.closest()
 * https://developer.mozilla.org/enUS/docs/Web/API/Element/closest#Polyfill
 */
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        "use strict";
        var el = this;
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (el.matches(s)) {
                return el;
            }
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

/*******************************************************************************
 * Copyright 2019 Adobe
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
(function() {
    "use strict";

    var containerUtils = window.CQ && window.CQ.CoreComponents && window.CQ.CoreComponents.container && window.CQ.CoreComponents.container.utils ? window.CQ.CoreComponents.container.utils : undefined;
    if (!containerUtils) {
        // eslint-disable-next-line no-console
        console.warn("Accordion: container utilities at window.CQ.CoreComponents.container.utils are not available. This can lead to missing features. Ensure the core.wcm.components.commons.site.container client library is included on the page.");
    }
    var dataLayerEnabled;
    var dataLayer;
    var delay = 100;

    var NS = "cmp";
    var IS = "accordion";

    var keyCodes = {
        ENTER: 13,
        SPACE: 32,
        END: 35,
        HOME: 36,
        ARROW_LEFT: 37,
        ARROW_UP: 38,
        ARROW_RIGHT: 39,
        ARROW_DOWN: 40
    };

    var selectors = {
        self: "[data-" + NS + '-is="' + IS + '"]'
    };

    var cssClasses = {
        button: {
            disabled: "cmp-accordion__button--disabled",
            expanded: "cmp-accordion__button--expanded"
        },
        panel: {
            hidden: "cmp-accordion__panel--hidden",
            expanded: "cmp-accordion__panel--expanded"
        }
    };

    var dataAttributes = {
        item: {
            expanded: "data-cmp-expanded"
        }
    };

    var properties = {
        /**
         * Determines whether a single accordion item is forced to be expanded at a time.
         * Expanding one item will collapse all others.
         *
         * @memberof Accordion
         * @type {Boolean}
         * @default false
         */
        "singleExpansion": {
            "default": false,
            "transform": function(value) {
                return !(value === null || typeof value === "undefined");
            }
        }
    };

    /**
     * Accordion Configuration.
     *
     * @typedef {Object} AccordionConfig Represents an Accordion configuration
     * @property {HTMLElement} element The HTMLElement representing the Accordion
     * @property {Object} options The Accordion options
     */

    /**
     * Accordion.
     *
     * @class Accordion
     * @classdesc An interactive Accordion component for toggling panels of related content
     * @param {AccordionConfig} config The Accordion configuration
     */
    function Accordion(config) {
        var that = this;

        if (config && config.element) {
            init(config);
        }

        /**
         * Initializes the Accordion.
         *
         * @private
         * @param {AccordionConfig} config The Accordion configuration
         */
        function init(config) {
            that._config = config;

            // prevents multiple initialization
            config.element.removeAttribute("data-" + NS + "-is");

            setupProperties(config.options);
            cacheElements(config.element);

            if (that._elements["item"]) {
                // ensures multiple element types are arrays.
                that._elements["item"] = Array.isArray(that._elements["item"]) ? that._elements["item"] : [that._elements["item"]];
                that._elements["button"] = Array.isArray(that._elements["button"]) ? that._elements["button"] : [that._elements["button"]];
                that._elements["panel"] = Array.isArray(that._elements["panel"]) ? that._elements["panel"] : [that._elements["panel"]];

                // Expand the item based on deep-link-id if it matches with any existing accordion item id
                if (containerUtils) {
                    var deepLinkItem = containerUtils.getDeepLinkItem(that, "item");
                    if (deepLinkItem && !deepLinkItem.hasAttribute(dataAttributes.item.expanded)) {
                        setItemExpanded(deepLinkItem, true);
                    }
                }

                if (that._properties.singleExpansion) {
                    // No deep linking
                    if (!deepLinkItem) {
                        var expandedItems = getExpandedItems();
                        // no expanded item annotated, force the first item to display.
                        if (expandedItems.length === 0) {
                            toggle(0);
                        }
                        // multiple expanded items annotated, display the last item open.
                        if (expandedItems.length > 1) {
                            toggle(expandedItems.length - 1);
                        }
                    } else {
                        // Deep link case
                        // Collapse the items other than which is deep linked
                        for (var j = 0; j < that._elements["item"].length; j++) {
                            if (that._elements["item"][j].id !== deepLinkItem.id &&
                                that._elements["item"][j].hasAttribute(dataAttributes.item.expanded)) {
                                setItemExpanded(that._elements["item"][j], false);
                            }
                        }
                    }
                }

                refreshItems();
                bindEvents();

                if (window.Granite && window.Granite.author && window.Granite.author.MessageChannel) {
                    /*
                     * Editor message handling:
                     * - subscribe to "cmp.panelcontainer" message requests sent by the editor frame
                     * - check that the message data panel container type is correct and that the id (path) matches this specific Accordion component
                     * - if so, route the "navigate" operation to enact a navigation of the Accordion based on index data
                     */
                    window.CQ.CoreComponents.MESSAGE_CHANNEL = window.CQ.CoreComponents.MESSAGE_CHANNEL || new window.Granite.author.MessageChannel("cqauthor", window);
                    window.CQ.CoreComponents.MESSAGE_CHANNEL.subscribeRequestMessage("cmp.panelcontainer", function(message) {
                        if (message.data && message.data.type === "cmp-accordion" && message.data.id === that._elements.self.dataset["cmpPanelcontainerId"]) {
                            if (message.data.operation === "navigate") {
                                // switch to single expansion mode when navigating in edit mode.
                                var singleExpansion = that._properties.singleExpansion;
                                that._properties.singleExpansion = true;
                                toggle(message.data.index);

                                // revert to the configured state.
                                that._properties.singleExpansion = singleExpansion;
                            }
                        }
                    });
                }
            }
        }

        /**
         * Caches the Accordion elements as defined via the {@code data-accordion-hook="ELEMENT_NAME"} markup API.
         *
         * @private
         * @param {HTMLElement} wrapper The Accordion wrapper element
         */
        function cacheElements(wrapper) {
            that._elements = {};
            that._elements.self = wrapper;
            var hooks = that._elements.self.querySelectorAll("[data-" + NS + "-hook-" + IS + "]");

            for (var i = 0; i < hooks.length; i++) {
                var hook = hooks[i];
                if (hook.closest("." + NS + "-" + IS) === that._elements.self) { // only process own accordion elements
                    var capitalized = IS;
                    capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
                    var key = hook.dataset[NS + "Hook" + capitalized];
                    if (that._elements[key]) {
                        if (!Array.isArray(that._elements[key])) {
                            var tmp = that._elements[key];
                            that._elements[key] = [tmp];
                        }
                        that._elements[key].push(hook);
                    } else {
                        that._elements[key] = hook;
                    }
                }
            }
        }

        /**
         * Sets up properties for the Accordion based on the passed options.
         *
         * @private
         * @param {Object} options The Accordion options
         */
        function setupProperties(options) {
            that._properties = {};

            for (var key in properties) {
                if (Object.prototype.hasOwnProperty.call(properties, key)) {
                    var property = properties[key];
                    var value = null;

                    if (options && options[key] != null) {
                        value = options[key];

                        // transform the provided option
                        if (property && typeof property.transform === "function") {
                            value = property.transform(value);
                        }
                    }

                    if (value === null) {
                        // value still null, take the property default
                        value = properties[key]["default"];
                    }

                    that._properties[key] = value;
                }
            }
        }

        /**
         * Binds Accordion event handling.
         *
         * @private
         */
        function bindEvents() {
            var buttons = that._elements["button"];
            if (buttons) {
                for (var i = 0; i < buttons.length; i++) {
                    (function(index) {
                        buttons[i].addEventListener("click", function(event) {
                            toggle(index);
                            focusButton(index);
                        });
                        buttons[i].addEventListener("keydown", function(event) {
                            onButtonKeyDown(event, index);
                        });
                    })(i);
                }
            }
        }

        /**
         * Handles button keydown events.
         *
         * @private
         * @param {Object} event The keydown event
         * @param {Number} index The index of the button triggering the event
         */
        function onButtonKeyDown(event, index) {
            var lastIndex = that._elements["button"].length - 1;

            switch (event.keyCode) {
                case keyCodes.ARROW_LEFT:
                case keyCodes.ARROW_UP:
                    event.preventDefault();
                    if (index > 0) {
                        focusButton(index - 1);
                    }
                    break;
                case keyCodes.ARROW_RIGHT:
                case keyCodes.ARROW_DOWN:
                    event.preventDefault();
                    if (index < lastIndex) {
                        focusButton(index + 1);
                    }
                    break;
                case keyCodes.HOME:
                    event.preventDefault();
                    focusButton(0);
                    break;
                case keyCodes.END:
                    event.preventDefault();
                    focusButton(lastIndex);
                    break;
                case keyCodes.ENTER:
                case keyCodes.SPACE:
                    event.preventDefault();
                    toggle(index);
                    focusButton(index);
                    break;
                default:
                    return;
            }
        }

        /**
         * General handler for toggle of an item.
         *
         * @private
         * @param {Number} index The index of the item to toggle
         */
        function toggle(index) {
            var item = that._elements["item"][index];
            if (item) {
                if (that._properties.singleExpansion) {
                    // ensure only a single item is expanded if single expansion is enabled.
                    for (var i = 0; i < that._elements["item"].length; i++) {
                        if (that._elements["item"][i] !== item) {
                            var expanded = getItemExpanded(that._elements["item"][i]);
                            if (expanded) {
                                setItemExpanded(that._elements["item"][i], false);
                            }
                        }
                    }
                }
                setItemExpanded(item, !getItemExpanded(item));

                if (dataLayerEnabled) {
                    var accordionId = that._elements.self.id;
                    var expandedItems = getExpandedItems()
                        .map(function(item) {
                            return getDataLayerId(item);
                        });

                    var uploadPayload = { component: {} };
                    uploadPayload.component[accordionId] = { shownItems: expandedItems };

                    var removePayload = { component: {} };
                    removePayload.component[accordionId] = { shownItems: undefined };

                    dataLayer.push(removePayload);
                    dataLayer.push(uploadPayload);
                }
            }
        }

        /**
         * Sets an item's expanded state based on the provided flag and refreshes its internals.
         *
         * @private
         * @param {HTMLElement} item The item to mark as expanded, or not expanded
         * @param {Boolean} expanded true to mark the item expanded, false otherwise
         */
        function setItemExpanded(item, expanded) {
            if (expanded) {
                item.setAttribute(dataAttributes.item.expanded, "");
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:show",
                        eventInfo: {
                            path: "component." + getDataLayerId(item)
                        }
                    });
                }

            } else {
                item.removeAttribute(dataAttributes.item.expanded);
                if (dataLayerEnabled) {
                    dataLayer.push({
                        event: "cmp:hide",
                        eventInfo: {
                            path: "component." + getDataLayerId(item)
                        }
                    });
                }
            }
            refreshItem(item);
        }

        /**
         * Gets an item's expanded state.
         *
         * @private
         * @param {HTMLElement} item The item for checking its expanded state
         * @returns {Boolean} true if the item is expanded, false otherwise
         */
        function getItemExpanded(item) {
            return item && item.dataset && item.dataset["cmpExpanded"] !== undefined;
        }

        /**
         * Refreshes an item based on its expanded state.
         *
         * @private
         * @param {HTMLElement} item The item to refresh
         */
        function refreshItem(item) {
            var expanded = getItemExpanded(item);
            if (expanded) {
                expandItem(item);
            } else {
                collapseItem(item);
            }
        }

        /**
         * Refreshes all items based on their expanded state.
         *
         * @private
         */
        function refreshItems() {
            for (var i = 0; i < that._elements["item"].length; i++) {
                refreshItem(that._elements["item"][i]);
            }
        }

        /**
         * Returns all expanded items.
         *
         * @private
         * @returns {HTMLElement[]} The expanded items
         */
        function getExpandedItems() {
            var expandedItems = [];

            for (var i = 0; i < that._elements["item"].length; i++) {
                var item = that._elements["item"][i];
                var expanded = getItemExpanded(item);
                if (expanded) {
                    expandedItems.push(item);
                }
            }

            return expandedItems;
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as expanded
         */
        function expandItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.add(cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", true);
                }, delay);
                panel.classList.add(cssClasses.panel.expanded);
                panel.classList.remove(cssClasses.panel.hidden);
                panel.setAttribute("aria-hidden", false);
            }
        }

        /**
         * Annotates the item and its internals with
         * the necessary style and accessibility attributes to indicate it is not expanded.
         *
         * @private
         * @param {HTMLElement} item The item to annotate as not expanded
         */
        function collapseItem(item) {
            var index = that._elements["item"].indexOf(item);
            if (index > -1) {
                var button = that._elements["button"][index];
                var panel = that._elements["panel"][index];
                button.classList.remove(cssClasses.button.expanded);
                // used to fix some known screen readers issues in reading the correct state of the 'aria-expanded' attribute
                // e.g. https://bugs.webkit.org/show_bug.cgi?id=210934
                setTimeout(function() {
                    button.setAttribute("aria-expanded", false);
                }, delay);
                panel.classList.add(cssClasses.panel.hidden);
                panel.classList.remove(cssClasses.panel.expanded);
                panel.setAttribute("aria-hidden", true);
            }
        }

        /**
         * Focuses the button at the provided index.
         *
         * @private
         * @param {Number} index The index of the button to focus
         */
        function focusButton(index) {
            var button = that._elements["button"][index];
            button.focus();
        }
    }

    /**
     * Scrolls the browser when the URI fragment is changed to the item of the container Accordion component that corresponds to the deep link in the URL fragment,
       and displays its content.
     */
    function onHashChange() {
        if (location.hash && location.hash !== "#") {
            var anchorLocation = decodeURIComponent(location.hash);
            var anchorElement = document.querySelector(anchorLocation);
            if (anchorElement && anchorElement.classList.contains("cmp-accordion__item") && !anchorElement.hasAttribute("data-cmp-expanded")) {
                var anchorElementButton = document.querySelector(anchorLocation + "-button");
                if (anchorElementButton) {
                    anchorElementButton.click();
                }
            }
        }
    }

    /**
     * Reads options data from the Accordion wrapper element, defined via {@code data-cmp-*} data attributes.
     *
     * @private
     * @param {HTMLElement} element The Accordion element to read options data from
     * @returns {Object} The options read from the component data attributes
     */
    function readData(element) {
        var data = element.dataset;
        var options = [];
        var capitalized = IS;
        capitalized = capitalized.charAt(0).toUpperCase() + capitalized.slice(1);
        var reserved = ["is", "hook" + capitalized];

        for (var key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                var value = data[key];

                if (key.indexOf(NS) === 0) {
                    key = key.slice(NS.length);
                    key = key.charAt(0).toLowerCase() + key.substring(1);

                    if (reserved.indexOf(key) === -1) {
                        options[key] = value;
                    }
                }
            }
        }

        return options;
    }

    /**
     * Parses the dataLayer string and returns the ID
     *
     * @private
     * @param {HTMLElement} item the accordion item
     * @returns {String} dataLayerId or undefined
     */
    function getDataLayerId(item) {
        if (item) {
            if (item.dataset.cmpDataLayer) {
                return Object.keys(JSON.parse(item.dataset.cmpDataLayer))[0];
            } else {
                return item.id;
            }
        }
        return null;
    }

    /**
     * Document ready handler and DOM mutation observers. Initializes Accordion components as necessary.
     *
     * @private
     */
    function onDocumentReady() {
        dataLayerEnabled = document.body.hasAttribute("data-cmp-data-layer-enabled");
        dataLayer = (dataLayerEnabled) ? window.adobeDataLayer = window.adobeDataLayer || [] : undefined;

        var elements = document.querySelectorAll(selectors.self);
        for (var i = 0; i < elements.length; i++) {
            new Accordion({ element: elements[i], options: readData(elements[i]) });
        }

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
        var body = document.querySelector("body");
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // needed for IE
                var nodesArray = [].slice.call(mutation.addedNodes);
                if (nodesArray.length > 0) {
                    nodesArray.forEach(function(addedNode) {
                        if (addedNode.querySelectorAll) {
                            var elementsArray = [].slice.call(addedNode.querySelectorAll(selectors.self));
                            elementsArray.forEach(function(element) {
                                new Accordion({ element: element, options: readData(element) });
                            });
                        }
                    });
                }
            });
        });

        observer.observe(body, {
            subtree: true,
            childList: true,
            characterData: true
        });
    }

    if (document.readyState !== "loading") {
        onDocumentReady();
    } else {
        document.addEventListener("DOMContentLoaded", onDocumentReady);
    }

    if (containerUtils) {
        window.addEventListener("load", containerUtils.scrollToAnchor, false);
    }
    window.addEventListener("hashchange", onHashChange, false);

}());

$(document).ready(function () {
    const twilioConfValues = $("#twilioConfValues");
    $('.webChat').on("click", function (event) {
        event.preventDefault();
        const renderElement = document.getElementById("webChatWrapper");
        if (renderElement && window.chatModuleRender) {
            window.chatModuleRender.default(renderElement, {
                brand: twilioConfValues.data("twilio-brandname"),
                onChatWidgetClose: () => { }, //this callback will be trigger when chat widget has been closed
                applicationId: twilioConfValues.data("twilio-appid"), //according applicationId for brand
                env: twilioConfValues.data("twilio-env"), //the env which api should called, e.g 'qa','prod'
                loginUrl: twilioConfValues.data("twilio-loginurl"),
                platform: twilioConfValues.data("twilio-platform"), //go2bank.com should use 'baas', others should be 'legacy'
            });
        }
        $(".g2b-header__top-links--item").removeClass('active-submenu');
        $("body").removeClass('menu-open');
        event.stopImmediatePropagation();
    });
});

(function () {
    let initUTM = function () {
        if (window.location.hash) {
            let hashElement = window.location.hash.split("?");
            if (hashElement[1]) {
                window.location.hash = hashElement[0];
                window.location.search = hashElement[1];
            }
        }
        let _cache = {
            satellite: window._satellite,
            satVal: "",
            paramObj: {},
            hasParameters: false,
            currentHrefParamObj: {},
            utmParamQuery: '?',
            utmParamArray: [
                "fl",
                "utm_audience",
                "utm_campaign",
                "utm_campaign-goal",
                "utm_campaign-id",
                "utm_campaign-type",
                "utm_channel",
                "utm_content",
                "utm_detail1",
                "utm_detail2",
                "utm_detail3",
                "utm_detail4",
                "utm_medium",
                "utm_source",
                "utm_sourcecode",
                "utm_term"
            ]
        };

        const urlParams = new URLSearchParams(window.location.search);

        /**
         * modify the query params by adding unique params from utm object and existing params 
         * @param {String} currentHrefParam 
         */
        function _modifyParams(currentHrefParam) {
            //converting query string to object 
            _cache.currentHrefParamObj = JSON.parse('{"' + decodeURI(currentHrefParam).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');

            //combining the existing param object and the new params with unique values
            return $.extend(_cache.currentHrefParamObj, _cache.paramObj);
        }

        /**
         * append utm paramaters for all external urls on the page
         */
        function _appendTohref() {
            let pageUTMLinks = $('a:not([href^="/"], [href*="' + window.location.host + '"], [href^="#"], [href^="tel:"], [href^="mailto:"], [href*="careers.greendot.com"]), .form-url a');
            pageUTMLinks.each(function () {

                let currentHref = $(this).attr("href");

                if (currentHref) {
                    //if href already has query param then modify existing params else append new params
                    if (currentHref.indexOf("?") !== -1) {
                        _cache.utmParamQuery = '?' + $.param(_modifyParams(currentHref.substring(currentHref.indexOf("?") + 1)));
                        currentHref = currentHref.substr(0, currentHref.indexOf("?"));
                    } else {
                        _cache.utmParamQuery = '?' + $.param(_cache.paramObj);
                    }

                    //update the href with new utm query params
                    $(this).attr("href", currentHref + _cache.utmParamQuery);
                }
            });
        }

        /**
         * get valid utm variables set by analytics
         */
        function _getUTMParams() {
            _cache.utmParamArray.forEach(function (item) {
                _cache.satVal = _cache.satellite.getVar("aem_" + item);
                if (_cache.satVal) {
                    //select first param value in case of multiple utm params
                    _cache.paramObj[item] = typeof _cache.satVal === 'object' ? _cache.satVal[0] : _cache.satVal;
                    _cache.hasParameters = true;
                }
            });

            if (_cache.hasParameters) {
                _appendTohref();
            }
        }

        /**
         * get valid utm variables directly from the url
         */
        function _getUrlParams() {
            _cache.utmParamArray.forEach(function (item) {
                for (let param of urlParams.keys()) {
                    //check if the utm param is authentic and is one of the existing param
                    if (param === item) {
                        _cache.satVal = _cache.satellite.getVar("aem_" + item);
                        if (_cache.satVal) {
                            //select first param value in case of multiple utm params
                            _cache.paramObj[item] = typeof _cache.satVal === 'object' ? _cache.satVal[0] : _cache.satVal;
                            _cache.hasParameters = true;
                        }
                    }
                }
            });

            if (_cache.hasParameters) {
                _appendTohref();
            }
        }

        /**
         * Function that refreshes 1 minute cookie
         * @param {String} utmMedium utm_medium param value to be stored in cookie
         */
        function _refreshCookie() {
            let utmMedium = _cache.satellite.getVar("aem_utm_medium");
            let utmSource = _cache.satellite.getVar("aem_utm_source");

            if (utmMedium === "cobrand" && utmSource) {
                let d = new Date();
                d.setTime(d.getTime() + 60000);
                document.cookie = "utm_source=" + utmSource + ";" + "expires=" + d.toUTCString() + ";domain=go2bank.com; secure; path=/";
            }
        }


        /**
         * initialization function
         */
        function _init() {
            if (!_cache.satellite) {
                return;
            }

            if (urlParams && urlParams.toString().length) {
                _getUrlParams();
            } else {
                _getUTMParams();
            }

            _refreshCookie();
            setInterval(_refreshCookie, 60000);

        }

        _init();
    }

    if (window.ContextHub && ContextHub.getStore("brandstore")) {
        ContextHub.eventing.on(ContextHub.Constants.EVENT_TEASER_LOADED, function (event, data) {
            GDOT.utilities.callOnLoad(initUTM);
        });
    } else {
        window.onload = initUTM;
    }
    
    if (window.adobe) {
        if(window.adobe.target){
            document.addEventListener('at-content-rendering-succeeded', function (event) {
                initUTM();
            });
        }
        
    }    
})();
$(document).ready(function(){

    const themeSection = $('.theme-section');
    if(themeSection.length) {
    const brandLogoSection = $('.gd-brand-logo');
    const darkThemeDesktopLogo = brandLogoSection.attr("data-dark-theme-logo-desktop");
    const darkThemeMobileLogo = brandLogoSection.attr("data-dark-theme-logo-mobile");
    const liteThemeDesktopLogo = brandLogoSection.attr("data-light-theme-logo-desktop");
    const liteThemeMobileLogo = brandLogoSection.attr("data-light-theme-logo-mobile");
    const darkThemeText = themeSection.attr("data-dark-theme-text");
    const liteThemeText = themeSection.attr("data-light-theme-text");
    const darkThemeImgSrc = themeSection.attr("data-dark-theme-image");
    const lightThemeImgSrc = themeSection.attr("data-light-theme-image");
    const themeBtn = $('.theme-btn');
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const currentTheme = localStorage.getItem("theme");

    let  replacedThemeSection = themeSection.detach();
    replacedThemeSection.appendTo('.header-navigation__main');

    function darkThemeLogo(){
        themeBtn.find('img').attr("src",lightThemeImgSrc);
        themeBtn.find('.btn-text').text(liteThemeText); 
        brandLogoSection.find('.desktop-logo img').attr("src",darkThemeDesktopLogo );
        brandLogoSection.find('.mobile-logo img').attr("src",darkThemeMobileLogo );
    }

    function lightThemeLogo(){
        themeBtn.find('img').attr("src",darkThemeImgSrc);
        themeBtn.find('.btn-text').text(darkThemeText);  
        brandLogoSection.find('.desktop-logo img').attr("src",liteThemeDesktopLogo );
        brandLogoSection.find('.mobile-logo img').attr("src",liteThemeMobileLogo );
    }

    if(!currentTheme && prefersDarkMode.matches){
        darkThemeLogo();
        }
     else if(!currentTheme && !prefersDarkMode.matches){
        lightThemeLogo();
    } else if(currentTheme == "dark" && prefersDarkMode.matches){
        darkThemeLogo();
    } else if(currentTheme == "dark" && !prefersDarkMode.matches) {
        $('body').toggleClass("dark-theme");
        darkThemeLogo();
    } else if(currentTheme == "light" && prefersDarkMode.matches) {
        $('body').toggleClass("light-theme");
        lightThemeLogo();
    } else{
        lightThemeLogo();
    }
    
    

    themeBtn.click(function(){

        if(prefersDarkMode.matches){
            $('body').toggleClass("light-theme");
            var theme = $('body').hasClass("light-theme") ? "light" : "dark";
            if ( theme == "dark"){
                darkThemeLogo();
            } else if(theme == "light"){
                lightThemeLogo();
            }
        } else {
            $('body').toggleClass("dark-theme");
            var theme = $('body').hasClass("dark-theme") ? "dark" : "light";
            if ( theme == "dark"){
                darkThemeLogo();
            } else if(theme == "light"){
                lightThemeLogo();
            }
        }
        localStorage.setItem("theme",theme);
    })
  }
});
