import Vue from 'vue';
import * as _ from 'lodash';

declare module 'vue/types/vue' {
    interface Vue {
        _: typeof _;
    }
}

declare global {
    interface Window {
        G: any,
        EAMP_MAPCONFIG: any
    }
}
