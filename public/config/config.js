/**
 * @title:
 * @Description:
 * @author:lj
 * @date:
 */
window.CONFIG ={

    base_config:{
      httpUrl:'http://172.17.22.119:8080/',
      pathName:'bjsw',
    },
    olMap_config:{
      "olMapserver_vec":"http://172.17.10.180:11012/DataServer?T=vec_w&x={x}&y={y}&l={z}",
      "olMapserver_cva":"http://172.17.10.180:11012/DataServer?T=cva_w&x={x}&y={y}&l={z}",
      // "olMapserver_wmts":"http://172.17.10.180:11012/services/ogc/wmts/12",
      // "olMapserver_vec":"http://172.17.10.180:11012  " +
      // "/DataServer?T=vec_w&x={x}&y={y}&l={z}",
      // "olMapserver_cva":"http://172.17.10.180:11012/DataServer?T=cva_w&x={x}&y={y}&l={z}",
    },
    message_config:{
      messageUrl:'172.17.22.119',
      messagePost:':8088',
      messagePath:'cloud-push-server'
    }
  }
  