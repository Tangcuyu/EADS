declare module 'vue-socket.io' {
    import { PluginFunction, PluginObject } from 'vue';
    import { Store } from 'vuex';

    export interface VueSocketOptions {
        debug?: boolean;
        connection: string,
        vuex?: {
            store?: Store<any>,
            actionPrefix?: string,
            mutationPrefix?: string,
            options?: {
                useConnectionNamespace?: boolean
            }
        }
    }

    export default class VueSocketIO<T> implements PluginObject<T> {
        install: PluginFunction<T>
        constructor(options: VueSocketOptions);
    }
}
