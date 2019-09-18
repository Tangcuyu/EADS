function movePop(eve) {
    $('#'+eve)[0].onmousedown=function (e) {
        //fireInfo.style.cursor='move';
        var event = e || window.event;
        var disX, disY;
        disX = event.clientX - $('#'+eve)[0].offsetLeft,
            disY = event.clientY - $('#'+eve)[0].offsetTop;
        document.onmousemove = function (event) {
            var event = event || window.event,
                X = event.clientX,
                Y = event.clientY;
            var L, T;
            L = X - disX;
            T = Y - disY;
            if (L < 0) L = 0;
            if (T < 0) T = 0;
            if (L > document.documentElement.clientWidth - $('#'+eve)[0].offsetWidth)
                L = document.documentElement.clientWidth - $('#'+eve)[0].offsetWidth
            if (T > document.documentElement.clientHeight - $('#'+eve)[0].offsetHeight)
                T = document.documentElement.clientHeight - $('#'+eve)[0].offsetHeight;
            $('#'+eve)[0].style.left = L + 'px';
            $('#'+eve)[0].style.top = T + 'px';
            $('#'+eve)[0].style.margin = 0;
        }
        document.onmouseup = function () {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}