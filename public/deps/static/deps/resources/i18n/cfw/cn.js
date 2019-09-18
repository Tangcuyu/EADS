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
        containerId : "容器不能为空",
        data : "data不能为空"
    }
};

var gs_local =baseLocal.gs_local;