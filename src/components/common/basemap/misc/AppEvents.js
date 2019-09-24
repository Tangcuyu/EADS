/**
 * Created by 1 on 2017/9/11.
 * 所有定义的全局事件
 */

const events = {
    /**
     * 切换底图
     */
    SWITCH_BASE_LAYER: 'switch_base_layer',
    /**
     * 清屏
     */
    CLEAR_MAP: 'clear_map',
    /**
     * 标绘创建
     */
    PLOT_CREATED: 'plot_created',
    /**
     * 标绘更新
     */
    PLOT_UPDATED: 'plot_updated',
    /**
     * 标绘删除
     */
    PLOT_DELETE: 'plot_delete',
    /**
     * 标绘取消
     */
    PLOT_CANCELED: 'plot_canceled',
    /**
     * 标绘点击
     */
    PLOT_CLICKED:'plot_clicked',
    /**
     * 协同标绘添加标绘
     * */
    COLLABORATIVE_PLOT_CREATED: 'collaborative_plot_created',
    /**
     * 协同标绘更新标绘
     * */
    COLLABORATIVE_PLOT_UPDTAED: 'collaborative_plot_updated',
    /**
     * 协同标绘删除标绘
     * */
    COLLABORATIVE_PLOT_DELETE: 'collaborative_plot_delete',
    /**
     * 全局变量更新
     */
    GLOBAL_VALUE_SETTED:'global_val_setted'
};

export default {events}
