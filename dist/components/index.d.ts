import { QuartzComponent } from '@quartz-community/types';

interface SimpleSearchOptions {
    /** 桌面端是否在结果右侧显示页面预览 */
    enablePreview: boolean;
}
declare const _default: (userOpts?: Partial<SimpleSearchOptions>) => QuartzComponent;

export { _default as SimpleSearch, type SimpleSearchOptions };
