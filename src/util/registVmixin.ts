import Vue from 'vue';
import router from '@/router/router';
import store from '@/store/store';

Vue.mixin({
  computed: {
    defaultcomponent() {
      if (router.currentRoute.name) {
        const partname = router.currentRoute.name;
        const str = (store as any).state.vmdata[partname].component;
        return str;
      }
    },
    childrenDefaultComponent() {
      if (router.currentRoute.name) {
        const partname = router.currentRoute.name;
        const str = (store as any).state.vmdata[partname].children.default.component;
        return str;
      }
    },
    childrenAComponent() {
      if (router.currentRoute.name) {
        const partname = router.currentRoute.name;
        const str = (store as any).state.vmdata[partname].children.a.component;
        return str;
      }
    },
    childrenBComponent() {
      if (router.currentRoute.name) {
        const partname = router.currentRoute.name;
        const str = (store as any).state.vmdata[partname].children.b.component;
        return str;
      }
    }
  }
});
