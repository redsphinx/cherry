(function () {

    var searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('user')) {
        var victim_initial = searchParams.get('user');
    }
    function init_victim_initial() {
        $("#victim_smiley").first().text(victim_initial);
    }
    window.addEventListener('load', init_victim_initial, false);
})();