$(window).load(function () {

    setTimeout(function () {
        $("img:not([alt])").attr({ alt: "", role: "presentation" });
        $("iframe:not([title])").attr({ title: "Educational Video" });
    }, 1000);

});