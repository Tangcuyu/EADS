/**
 * Created by GSAFETY on 2017/6/15.
 */


if(!window.baseLocal) {
    window.baseLocal  = {}
    Object.defineProperty(window,'baseLocal',{
        writable: false,
        configurable: false
    })
}
baseLocal.gs_local = {
    global : {
        containerId : "The container cannot be empty",
        data : "The data cannot be empty",
    }
};

var gs_local =baseLocal.gs_local;