import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import uuidv1 from 'uuid/v1';
import * as _ from 'lodash';

import { Itreeconfig } from '../interface/treeconfig';
import { mutations } from '../interface/mutation-types';
import progressSituationDetailStore from './progresssituationdetailstore/progressSituationDetailStore';
import weatherStore from './weatherstore/weatherStore';
import { stat } from 'fs';


Vue.use(Vuex);
const vmconfig: Itreeconfig = {
  home: {
    component: 'LayoutGrid3cols',
    children: {
      default: {
        component: 'EqT1LeftNormal'
      },
      a: {
        component: 'BaseMap'
      },
      b: {
        component: 'EqT1RightNormal'
      },
    }
  },
  earthquake: {
    component: 'LayoutGrid3cols',
    children: {
      default: {
        component: 'EqT2LeftNormal'
      },
      a: {
        component: 'BaseMap'
      },
      b: {
        component: 'EqT2RightNormal'
      },
    }
  },
  flood: {
    component: 'LayoutFullMap',
    children: {
      default: {
        component: 'EqT1LeftNormal'
      },
      a: {
        component: 'BaseMap'
      },
      b: {
        component: 'EqT1RightNormal'
      },
    }
  },
  typhoon: {
    component: 'Layout3',
    children: {
      default: {
        component: 'part1'
      },
      a: {
        component: 'part2'
      },
      b: {
        component: 'part3'
      },
    }
  }
};

export default new Vuex.Store({
  state: {
    vmdata: vmconfig,
    allmap: {},
    panelleft: 'Left',
    nav: 'hide',
    disposalPdfPanel: {
      stateFlag: 'hide',
      pdfSrc: ''
    },
    responseDialog: {},
    gisMapInt: {
      toolsInt: 'hide',
      mapLegendInt: 'hide'
    }
  },
  mutations: {
    [mutations.CHANGEVMDATA](state, paramObj) {
      const leftlayout = paramObj.leftlayout;
      const rightlayout = paramObj.rightlayout;

      state.vmdata.home.children.default.component = leftlayout;
      state.vmdata.home.children.b.component = rightlayout;
    },
    [mutations.CHANGELAYOUT](state, paramObj) {
      const layout = paramObj.layout;
      state.vmdata.home.component = layout;
    },
    [mutations.NAVSTATUS](state, paramObj) {
      state.nav = 'show';
    },
    [mutations.CHANGEDISPOSALPDFPANEL](state, paramObj) {
      state.disposalPdfPanel = paramObj;
    },
    [mutations.CHANGERESPONSEDIALOG](state, paramObj) {
      state.responseDialog = paramObj;
    },
    [mutations.GISTOOLS](state, paramObj) {
      state.gisMapInt.toolsInt = 'show';
    },
    [mutations.GISLEGEND](state, paramObj) {
     state.gisMapInt.mapLegendInt = 'show';
    },
  },
  actions: {
    changeVmdata() {},
    changeLayout() {},
    navStatus() {},
    changeDisposalPdfPanel() {},
    changeResponseDialog() {},
    gisTools() {},
    gisLegend() {}
  },
  modules: {
    weatherStore,
    progressSituationDetailStore
  }
});
