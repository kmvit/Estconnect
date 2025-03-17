"use strict"

$(function() {

    // Бургер меню сайт
    $("#burger").on("click", () => {
        $("#burger").css("display","none")
        $("#close").css("display", "flex")
        $("#menu").addClass("show");
    })
    $("#close").on("click", () => {
        $("#close").css("display","none")
        $("#burger").css("display", "flex")
        $("#menu").removeClass("show");
    })

    // Бургер меню платформа
    $(".platform_header-open").on("click", () => {
        $(".platform_header-open").css("display","none")
        $(".platform_header-close").css("display", "flex")
        $(".platform_header_mobile").addClass("show");
    })
    $(".platform_header-close").on("click", () => {
        $(".platform_header-close").css("display","none")
        $(".platform_header-open").css("display", "flex")
        $(".platform_header_mobile").removeClass("show");
    })

    // Подключение каруселей
    let advantagesCarousel = $(".advantages-carousel");
    advantagesCarousel.owlCarousel({
        margin: 20,
        loop: true,
        nav: false,
        dots: true,
        autoplay: false,
        items: 1,
        dotsContainer: ".advantages-dots"
    });
    let objectMainScreenCarousel = $(".object_main-screen-carousel");
    objectMainScreenCarousel.owlCarousel({
        margin: 0,
        loop: true,
        nav: false,
        dots: false,
        autoplay: false,
        items: 1,
    });
    $(".object_main-screen-carousel-prev").on("click", function() {
        objectMainScreenCarousel.trigger("prev.owl.carousel");
    });

    $(".object_main-screen-carousel-next").on("click", function() {
        objectMainScreenCarousel.trigger("next.owl.carousel");
    });

    // Расширенный поиск

    $(".estate-search-advanced-open").on("click", function(event) {
        event.preventDefault();
        if ($(this).hasClass("active")) {
            $(".estate-search-advanced-open-icon").attr("src", "./assets/icons/advanced-search-icon.svg");
            $(this).removeClass("active");
            $(".estate-search-form-item-advanced").css("display", "none");
            $("#estate-search-advanced-open-span").text("Расширенный поиск");
            $(".estate-search-form-items").css("margin-bottom", "14px");
        } else {
            $(".estate-search-advanced-open-icon").attr("src", "./assets/icons/advanced-search-icon-close.svg");
            $(this).addClass("active");
            $(".estate-search-form-item-advanced").css("display", "flex");
            $("#estate-search-advanced-open-span").text("Компактный поиск");
            $(".estate-search-form-items").css("margin-bottom", "55px");
        }
    });


    // Выпадающие меню

    function setupDropdown(prefix) {
        let wrapperSelector = `.${prefix}-dropdown-button-wrapper`;
        let dropdownSelector = `.${prefix}-dropdown`;
        let buttonSelector = `.${prefix}-dropdown-button`;
        let contentSelector = `.${prefix}-dropdown-content`;

        $(wrapperSelector).on("click", function() {
            $(dropdownSelector).toggleClass('active');
            $(contentSelector).toggle();
        });

        $(`${contentSelector} div`).on("click", function() {
            $(buttonSelector).text($(this).text());
            $(contentSelector).hide();
            $(dropdownSelector).removeClass('active');
        });

        $(document).on("click",function(event) {
            if (!$(event.target).closest(dropdownSelector).length) {
                $(contentSelector).hide();
                $(dropdownSelector).removeClass('active');
            }
        });
    }

    ['platform_header-user', 'sort', 'price', 'beachWay',"objectType","category",
        "country","accountCountry","paymentMethod","whereSendAccount","objectPlusEstateType",
        "objectPlusComfort","objectPlusPravo","objectPlusStatus","profile_language",
        "profile_communication"
    ].forEach(setupDropdown);


    // Свичи избранное
    $(".favourites_switch").click(function() {
        $(".favourites_switch").removeClass("active"); // Убираем активный класс у всех кнопок
        $(this).addClass("active"); // Добавляем активный класс к нажатой кнопке

        let target = $(this).attr("id").replace("favourites_switch-", ""); // Определяем, какая кнопка нажата

        $(".object_other-items").hide(); // Скрываем все блоки
        $("#favourites_content-" + target).show(); // Показываем нужный блок
    });

    $("#favourites_switch-objects").trigger("click"); // Активируем первую вкладку при загрузке страницы
























})