import Vue from 'vue';
import * as _ from 'lodash';
import { VueBus } from 'vue-bus';


declare module 'vue/types/vue' {
    interface Vue {
        _: typeof _;
        $bus: VueBus;
    }
}

declare global {
    interface Window {
        G: any,
        EAMP_MAPCONFIG: any
    }
}
