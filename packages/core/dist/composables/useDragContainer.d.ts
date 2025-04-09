/**
 * Hook for creating custom drag container with overlay management.
 * Provides functionality for controlling drag visualization and element positioning.
 *
 * This hook is typically used to create custom drag overlays, layers,
 * and control how dragged elements are displayed during drag operations.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *  import { computed } from 'vue';
 *  import { useDragContainer } from '../composables/useDragContainer';
 *
 *  const { elementRef, pointerPosition, isDragging, draggingElements } =
 *    useDragContainer();
 *
 *  const computedStyle = computed(() => ({
 *    transform: `translate3d(${
 *      (pointerPosition.current.value?.x ?? 0) -
 *      (pointerPosition.offset.pixel.value?.x ?? 0)
 *    }px, ${
 *      (pointerPosition.current.value?.y ?? 0) -
 *      (pointerPosition.offset.pixel.value?.y ?? 0)
 *    }px, 0)`,
 *  }));
 *</script>
 *
 *<template>
 *  <Teleport to="body">
 *    <div
 *      v-if="isDragging"
 *      ref="elementRef"
 *      :style="computedStyle"
 *      class="default-drag-overlay"
 *    >
 *      <div
 *        v-for="(element, index) in draggingElements"
 *        :key="index"
 *        v-html="element.initialHTML"
 *        :style="{
 *          width: `${element.initialRect?.width}px`,
 *          height: `${element.initialRect?.height}px`,
 *        }"
 *      />
 *    </div>
 *  </Teleport>
 *</template>
 *
 *<style scoped>
 *  .default-drag-overlay {
 *    position: fixed;
 *    top: 0;
 *    left: 0;
 *    background-color: rgba(0, 0, 0, 0.5);
 *    transition: 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
 *    z-index: 1000;
 *  }
 *</style>
 *
 * ```
 *
 * @returns {Object} Container controls and state
 * @property {Ref<HTMLElement | null>} elementRef - Reference to be bound to container element
 * @property {Ref<IDragElement[]>} draggingElements - Currently dragged elements
 * @property {IPointerPosition} pointerPosition - Current pointer coordinates and offsets
 * @property {Ref<boolean>} isDragging - Whether drag operation is in progress
 */
export declare const useDragContainer: () => {
    elementRef: import('vue').Ref<HTMLElement | null, HTMLElement | null>;
    draggingElements: import('vue').Ref<{
        initialHTML: string;
        initialRect?: {
            height: number;
            width: number;
            x: number;
            y: number;
            readonly bottom: number;
            readonly left: number;
            readonly right: number;
            readonly top: number;
            toJSON: () => any;
        } | undefined;
        node: HTMLElement | Element | null;
        groups: string[];
        layer: import('vue').FunctionalComponent<any, {}, any, {}> | {
            new (...args: any[]): any;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
        } | {
            [x: string]: any;
            setup?: ((this: void, props: import('@vue/shared').LooseRequired<any>, ctx: {
                attrs: {
                    [x: string]: unknown;
                };
                slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                emit: ((event: unknown, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);
                expose: <Exposed extends Record<string, any> = Record<string, any>>(exposed?: Exposed | undefined) => void;
            }) => any) | undefined;
            name?: string | undefined;
            template?: string | object | undefined;
            render?: Function | undefined;
            components?: Record<string, import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any>> | undefined;
            directives?: Record<string, import('vue').Directive<any, any, string, string>> | undefined;
            inheritAttrs?: boolean | undefined;
            emits?: any;
            slots?: {} | undefined;
            expose?: string[] | undefined;
            serverPrefetch?: (() => void | Promise<any>) | undefined;
            compilerOptions?: {
                isCustomElement?: ((tag: string) => boolean) | undefined;
                whitespace?: "preserve" | "condense" | undefined;
                comments?: boolean | undefined;
                delimiters?: [string, string] | undefined;
            } | undefined;
            call?: ((this: unknown, ...args: unknown[]) => never) | undefined;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
            __defaults?: {} | undefined;
            compatConfig?: {
                GLOBAL_MOUNT?: boolean | "suppress-warning" | undefined;
                GLOBAL_MOUNT_CONTAINER?: boolean | "suppress-warning" | undefined;
                GLOBAL_EXTEND?: boolean | "suppress-warning" | undefined;
                GLOBAL_PROTOTYPE?: boolean | "suppress-warning" | undefined;
                GLOBAL_SET?: boolean | "suppress-warning" | undefined;
                GLOBAL_DELETE?: boolean | "suppress-warning" | undefined;
                GLOBAL_OBSERVABLE?: boolean | "suppress-warning" | undefined;
                GLOBAL_PRIVATE_UTIL?: boolean | "suppress-warning" | undefined;
                CONFIG_SILENT?: boolean | "suppress-warning" | undefined;
                CONFIG_DEVTOOLS?: boolean | "suppress-warning" | undefined;
                CONFIG_KEY_CODES?: boolean | "suppress-warning" | undefined;
                CONFIG_PRODUCTION_TIP?: boolean | "suppress-warning" | undefined;
                CONFIG_IGNORED_ELEMENTS?: boolean | "suppress-warning" | undefined;
                CONFIG_WHITESPACE?: boolean | "suppress-warning" | undefined;
                CONFIG_OPTION_MERGE_STRATS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SET?: boolean | "suppress-warning" | undefined;
                INSTANCE_DELETE?: boolean | "suppress-warning" | undefined;
                INSTANCE_DESTROY?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_EMITTER?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_HOOKS?: boolean | "suppress-warning" | undefined;
                INSTANCE_CHILDREN?: boolean | "suppress-warning" | undefined;
                INSTANCE_LISTENERS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SCOPED_SLOTS?: boolean | "suppress-warning" | undefined;
                INSTANCE_ATTRS_CLASS_STYLE?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_FN?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_MERGE?: boolean | "suppress-warning" | undefined;
                OPTIONS_BEFORE_DESTROY?: boolean | "suppress-warning" | undefined;
                OPTIONS_DESTROYED?: boolean | "suppress-warning" | undefined;
                WATCH_ARRAY?: boolean | "suppress-warning" | undefined;
                PROPS_DEFAULT_THIS?: boolean | "suppress-warning" | undefined;
                V_ON_KEYCODE_MODIFIER?: boolean | "suppress-warning" | undefined;
                CUSTOM_DIR?: boolean | "suppress-warning" | undefined;
                ATTR_FALSE_VALUE?: boolean | "suppress-warning" | undefined;
                ATTR_ENUMERATED_COERCION?: boolean | "suppress-warning" | undefined;
                TRANSITION_CLASSES?: boolean | "suppress-warning" | undefined;
                TRANSITION_GROUP_ROOT?: boolean | "suppress-warning" | undefined;
                COMPONENT_ASYNC?: boolean | "suppress-warning" | undefined;
                COMPONENT_FUNCTIONAL?: boolean | "suppress-warning" | undefined;
                COMPONENT_V_MODEL?: boolean | "suppress-warning" | undefined;
                RENDER_FUNCTION?: boolean | "suppress-warning" | undefined;
                FILTERS?: boolean | "suppress-warning" | undefined;
                PRIVATE_APIS?: boolean | "suppress-warning" | undefined;
                MODE?: 2 | 3 | ((comp: import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any> | null) => 2 | 3) | undefined;
            } | undefined;
            data?: ((this: any, vm: any) => any) | undefined;
            computed?: import('vue').ComputedOptions | undefined;
            methods?: import('vue').MethodOptions | undefined;
            watch?: {
                [x: string]: (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>)) | (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>))[];
            } | undefined;
            provide?: import('vue').ComponentProvideOptions | undefined;
            inject?: {} | string[] | undefined;
            filters?: Record<string, Function> | undefined;
            mixins?: any[] | undefined;
            extends?: any;
            beforeCreate?: (() => void) | undefined;
            created?: (() => void) | undefined;
            beforeMount?: (() => void) | undefined;
            mounted?: (() => void) | undefined;
            beforeUpdate?: (() => void) | undefined;
            updated?: (() => void) | undefined;
            activated?: (() => void) | undefined;
            deactivated?: (() => void) | undefined;
            beforeDestroy?: (() => void) | undefined;
            beforeUnmount?: (() => void) | undefined;
            destroyed?: (() => void) | undefined;
            unmounted?: (() => void) | undefined;
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => boolean | void) | undefined;
            delimiters?: [string, string] | undefined;
            __differentiator?: string | number | symbol | undefined;
            __isBuiltIn?: boolean | undefined;
            __file?: string | undefined;
            __name?: string | undefined;
        } | null;
        defaultLayer: import('vue').FunctionalComponent<any, {}, any, {}> | {
            new (...args: any[]): any;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
        } | {
            [x: string]: any;
            setup?: ((this: void, props: import('@vue/shared').LooseRequired<any>, ctx: {
                attrs: {
                    [x: string]: unknown;
                };
                slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                emit: ((event: unknown, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);
                expose: <Exposed extends Record<string, any> = Record<string, any>>(exposed?: Exposed | undefined) => void;
            }) => any) | undefined;
            name?: string | undefined;
            template?: string | object | undefined;
            render?: Function | undefined;
            components?: Record<string, import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any>> | undefined;
            directives?: Record<string, import('vue').Directive<any, any, string, string>> | undefined;
            inheritAttrs?: boolean | undefined;
            emits?: any;
            slots?: {} | undefined;
            expose?: string[] | undefined;
            serverPrefetch?: (() => void | Promise<any>) | undefined;
            compilerOptions?: {
                isCustomElement?: ((tag: string) => boolean) | undefined;
                whitespace?: "preserve" | "condense" | undefined;
                comments?: boolean | undefined;
                delimiters?: [string, string] | undefined;
            } | undefined;
            call?: ((this: unknown, ...args: unknown[]) => never) | undefined;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
            __defaults?: {} | undefined;
            compatConfig?: {
                GLOBAL_MOUNT?: boolean | "suppress-warning" | undefined;
                GLOBAL_MOUNT_CONTAINER?: boolean | "suppress-warning" | undefined;
                GLOBAL_EXTEND?: boolean | "suppress-warning" | undefined;
                GLOBAL_PROTOTYPE?: boolean | "suppress-warning" | undefined;
                GLOBAL_SET?: boolean | "suppress-warning" | undefined;
                GLOBAL_DELETE?: boolean | "suppress-warning" | undefined;
                GLOBAL_OBSERVABLE?: boolean | "suppress-warning" | undefined;
                GLOBAL_PRIVATE_UTIL?: boolean | "suppress-warning" | undefined;
                CONFIG_SILENT?: boolean | "suppress-warning" | undefined;
                CONFIG_DEVTOOLS?: boolean | "suppress-warning" | undefined;
                CONFIG_KEY_CODES?: boolean | "suppress-warning" | undefined;
                CONFIG_PRODUCTION_TIP?: boolean | "suppress-warning" | undefined;
                CONFIG_IGNORED_ELEMENTS?: boolean | "suppress-warning" | undefined;
                CONFIG_WHITESPACE?: boolean | "suppress-warning" | undefined;
                CONFIG_OPTION_MERGE_STRATS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SET?: boolean | "suppress-warning" | undefined;
                INSTANCE_DELETE?: boolean | "suppress-warning" | undefined;
                INSTANCE_DESTROY?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_EMITTER?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_HOOKS?: boolean | "suppress-warning" | undefined;
                INSTANCE_CHILDREN?: boolean | "suppress-warning" | undefined;
                INSTANCE_LISTENERS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SCOPED_SLOTS?: boolean | "suppress-warning" | undefined;
                INSTANCE_ATTRS_CLASS_STYLE?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_FN?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_MERGE?: boolean | "suppress-warning" | undefined;
                OPTIONS_BEFORE_DESTROY?: boolean | "suppress-warning" | undefined;
                OPTIONS_DESTROYED?: boolean | "suppress-warning" | undefined;
                WATCH_ARRAY?: boolean | "suppress-warning" | undefined;
                PROPS_DEFAULT_THIS?: boolean | "suppress-warning" | undefined;
                V_ON_KEYCODE_MODIFIER?: boolean | "suppress-warning" | undefined;
                CUSTOM_DIR?: boolean | "suppress-warning" | undefined;
                ATTR_FALSE_VALUE?: boolean | "suppress-warning" | undefined;
                ATTR_ENUMERATED_COERCION?: boolean | "suppress-warning" | undefined;
                TRANSITION_CLASSES?: boolean | "suppress-warning" | undefined;
                TRANSITION_GROUP_ROOT?: boolean | "suppress-warning" | undefined;
                COMPONENT_ASYNC?: boolean | "suppress-warning" | undefined;
                COMPONENT_FUNCTIONAL?: boolean | "suppress-warning" | undefined;
                COMPONENT_V_MODEL?: boolean | "suppress-warning" | undefined;
                RENDER_FUNCTION?: boolean | "suppress-warning" | undefined;
                FILTERS?: boolean | "suppress-warning" | undefined;
                PRIVATE_APIS?: boolean | "suppress-warning" | undefined;
                MODE?: 2 | 3 | ((comp: import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any> | null) => 2 | 3) | undefined;
            } | undefined;
            data?: ((this: any, vm: any) => any) | undefined;
            computed?: import('vue').ComputedOptions | undefined;
            methods?: import('vue').MethodOptions | undefined;
            watch?: {
                [x: string]: (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>)) | (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>))[];
            } | undefined;
            provide?: import('vue').ComponentProvideOptions | undefined;
            inject?: {} | string[] | undefined;
            filters?: Record<string, Function> | undefined;
            mixins?: any[] | undefined;
            extends?: any;
            beforeCreate?: (() => void) | undefined;
            created?: (() => void) | undefined;
            beforeMount?: (() => void) | undefined;
            mounted?: (() => void) | undefined;
            beforeUpdate?: (() => void) | undefined;
            updated?: (() => void) | undefined;
            activated?: (() => void) | undefined;
            deactivated?: (() => void) | undefined;
            beforeDestroy?: (() => void) | undefined;
            beforeUnmount?: (() => void) | undefined;
            destroyed?: (() => void) | undefined;
            unmounted?: (() => void) | undefined;
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => boolean | void) | undefined;
            delimiters?: [string, string] | undefined;
            __differentiator?: string | number | symbol | undefined;
            __isBuiltIn?: boolean | undefined;
            __file?: string | undefined;
            __name?: string | undefined;
        } | null;
        data: any;
        events: {
            onHover?: ((store: import('..').IDnDStore) => void) | undefined;
            onLeave?: ((store: import('..').IDnDStore) => void) | undefined;
            onEnd?: ((store: import('..').IDnDStore) => void) | undefined;
        };
    }[], import('..').IDraggingElement[] | {
        initialHTML: string;
        initialRect?: {
            height: number;
            width: number;
            x: number;
            y: number;
            readonly bottom: number;
            readonly left: number;
            readonly right: number;
            readonly top: number;
            toJSON: () => any;
        } | undefined;
        node: HTMLElement | Element | null;
        groups: string[];
        layer: import('vue').FunctionalComponent<any, {}, any, {}> | {
            new (...args: any[]): any;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
        } | {
            [x: string]: any;
            setup?: ((this: void, props: import('@vue/shared').LooseRequired<any>, ctx: {
                attrs: {
                    [x: string]: unknown;
                };
                slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                emit: ((event: unknown, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);
                expose: <Exposed extends Record<string, any> = Record<string, any>>(exposed?: Exposed | undefined) => void;
            }) => any) | undefined;
            name?: string | undefined;
            template?: string | object | undefined;
            render?: Function | undefined;
            components?: Record<string, import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any>> | undefined;
            directives?: Record<string, import('vue').Directive<any, any, string, string>> | undefined;
            inheritAttrs?: boolean | undefined;
            emits?: any;
            slots?: {} | undefined;
            expose?: string[] | undefined;
            serverPrefetch?: (() => void | Promise<any>) | undefined;
            compilerOptions?: {
                isCustomElement?: ((tag: string) => boolean) | undefined;
                whitespace?: "preserve" | "condense" | undefined;
                comments?: boolean | undefined;
                delimiters?: [string, string] | undefined;
            } | undefined;
            call?: ((this: unknown, ...args: unknown[]) => never) | undefined;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
            __defaults?: {} | undefined;
            compatConfig?: {
                GLOBAL_MOUNT?: boolean | "suppress-warning" | undefined;
                GLOBAL_MOUNT_CONTAINER?: boolean | "suppress-warning" | undefined;
                GLOBAL_EXTEND?: boolean | "suppress-warning" | undefined;
                GLOBAL_PROTOTYPE?: boolean | "suppress-warning" | undefined;
                GLOBAL_SET?: boolean | "suppress-warning" | undefined;
                GLOBAL_DELETE?: boolean | "suppress-warning" | undefined;
                GLOBAL_OBSERVABLE?: boolean | "suppress-warning" | undefined;
                GLOBAL_PRIVATE_UTIL?: boolean | "suppress-warning" | undefined;
                CONFIG_SILENT?: boolean | "suppress-warning" | undefined;
                CONFIG_DEVTOOLS?: boolean | "suppress-warning" | undefined;
                CONFIG_KEY_CODES?: boolean | "suppress-warning" | undefined;
                CONFIG_PRODUCTION_TIP?: boolean | "suppress-warning" | undefined;
                CONFIG_IGNORED_ELEMENTS?: boolean | "suppress-warning" | undefined;
                CONFIG_WHITESPACE?: boolean | "suppress-warning" | undefined;
                CONFIG_OPTION_MERGE_STRATS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SET?: boolean | "suppress-warning" | undefined;
                INSTANCE_DELETE?: boolean | "suppress-warning" | undefined;
                INSTANCE_DESTROY?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_EMITTER?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_HOOKS?: boolean | "suppress-warning" | undefined;
                INSTANCE_CHILDREN?: boolean | "suppress-warning" | undefined;
                INSTANCE_LISTENERS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SCOPED_SLOTS?: boolean | "suppress-warning" | undefined;
                INSTANCE_ATTRS_CLASS_STYLE?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_FN?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_MERGE?: boolean | "suppress-warning" | undefined;
                OPTIONS_BEFORE_DESTROY?: boolean | "suppress-warning" | undefined;
                OPTIONS_DESTROYED?: boolean | "suppress-warning" | undefined;
                WATCH_ARRAY?: boolean | "suppress-warning" | undefined;
                PROPS_DEFAULT_THIS?: boolean | "suppress-warning" | undefined;
                V_ON_KEYCODE_MODIFIER?: boolean | "suppress-warning" | undefined;
                CUSTOM_DIR?: boolean | "suppress-warning" | undefined;
                ATTR_FALSE_VALUE?: boolean | "suppress-warning" | undefined;
                ATTR_ENUMERATED_COERCION?: boolean | "suppress-warning" | undefined;
                TRANSITION_CLASSES?: boolean | "suppress-warning" | undefined;
                TRANSITION_GROUP_ROOT?: boolean | "suppress-warning" | undefined;
                COMPONENT_ASYNC?: boolean | "suppress-warning" | undefined;
                COMPONENT_FUNCTIONAL?: boolean | "suppress-warning" | undefined;
                COMPONENT_V_MODEL?: boolean | "suppress-warning" | undefined;
                RENDER_FUNCTION?: boolean | "suppress-warning" | undefined;
                FILTERS?: boolean | "suppress-warning" | undefined;
                PRIVATE_APIS?: boolean | "suppress-warning" | undefined;
                MODE?: 2 | 3 | ((comp: import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any> | null) => 2 | 3) | undefined;
            } | undefined;
            data?: ((this: any, vm: any) => any) | undefined;
            computed?: import('vue').ComputedOptions | undefined;
            methods?: import('vue').MethodOptions | undefined;
            watch?: {
                [x: string]: (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>)) | (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>))[];
            } | undefined;
            provide?: import('vue').ComponentProvideOptions | undefined;
            inject?: {} | string[] | undefined;
            filters?: Record<string, Function> | undefined;
            mixins?: any[] | undefined;
            extends?: any;
            beforeCreate?: (() => void) | undefined;
            created?: (() => void) | undefined;
            beforeMount?: (() => void) | undefined;
            mounted?: (() => void) | undefined;
            beforeUpdate?: (() => void) | undefined;
            updated?: (() => void) | undefined;
            activated?: (() => void) | undefined;
            deactivated?: (() => void) | undefined;
            beforeDestroy?: (() => void) | undefined;
            beforeUnmount?: (() => void) | undefined;
            destroyed?: (() => void) | undefined;
            unmounted?: (() => void) | undefined;
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => boolean | void) | undefined;
            delimiters?: [string, string] | undefined;
            __differentiator?: string | number | symbol | undefined;
            __isBuiltIn?: boolean | undefined;
            __file?: string | undefined;
            __name?: string | undefined;
        } | null;
        defaultLayer: import('vue').FunctionalComponent<any, {}, any, {}> | {
            new (...args: any[]): any;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
        } | {
            [x: string]: any;
            setup?: ((this: void, props: import('@vue/shared').LooseRequired<any>, ctx: {
                attrs: {
                    [x: string]: unknown;
                };
                slots: Readonly<{
                    [name: string]: import('vue').Slot<any> | undefined;
                }>;
                emit: ((event: unknown, ...args: any[]) => void) | ((event: string, ...args: any[]) => void);
                expose: <Exposed extends Record<string, any> = Record<string, any>>(exposed?: Exposed | undefined) => void;
            }) => any) | undefined;
            name?: string | undefined;
            template?: string | object | undefined;
            render?: Function | undefined;
            components?: Record<string, import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any>> | undefined;
            directives?: Record<string, import('vue').Directive<any, any, string, string>> | undefined;
            inheritAttrs?: boolean | undefined;
            emits?: any;
            slots?: {} | undefined;
            expose?: string[] | undefined;
            serverPrefetch?: (() => void | Promise<any>) | undefined;
            compilerOptions?: {
                isCustomElement?: ((tag: string) => boolean) | undefined;
                whitespace?: "preserve" | "condense" | undefined;
                comments?: boolean | undefined;
                delimiters?: [string, string] | undefined;
            } | undefined;
            call?: ((this: unknown, ...args: unknown[]) => never) | undefined;
            __isFragment?: undefined;
            __isTeleport?: undefined;
            __isSuspense?: undefined;
            __defaults?: {} | undefined;
            compatConfig?: {
                GLOBAL_MOUNT?: boolean | "suppress-warning" | undefined;
                GLOBAL_MOUNT_CONTAINER?: boolean | "suppress-warning" | undefined;
                GLOBAL_EXTEND?: boolean | "suppress-warning" | undefined;
                GLOBAL_PROTOTYPE?: boolean | "suppress-warning" | undefined;
                GLOBAL_SET?: boolean | "suppress-warning" | undefined;
                GLOBAL_DELETE?: boolean | "suppress-warning" | undefined;
                GLOBAL_OBSERVABLE?: boolean | "suppress-warning" | undefined;
                GLOBAL_PRIVATE_UTIL?: boolean | "suppress-warning" | undefined;
                CONFIG_SILENT?: boolean | "suppress-warning" | undefined;
                CONFIG_DEVTOOLS?: boolean | "suppress-warning" | undefined;
                CONFIG_KEY_CODES?: boolean | "suppress-warning" | undefined;
                CONFIG_PRODUCTION_TIP?: boolean | "suppress-warning" | undefined;
                CONFIG_IGNORED_ELEMENTS?: boolean | "suppress-warning" | undefined;
                CONFIG_WHITESPACE?: boolean | "suppress-warning" | undefined;
                CONFIG_OPTION_MERGE_STRATS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SET?: boolean | "suppress-warning" | undefined;
                INSTANCE_DELETE?: boolean | "suppress-warning" | undefined;
                INSTANCE_DESTROY?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_EMITTER?: boolean | "suppress-warning" | undefined;
                INSTANCE_EVENT_HOOKS?: boolean | "suppress-warning" | undefined;
                INSTANCE_CHILDREN?: boolean | "suppress-warning" | undefined;
                INSTANCE_LISTENERS?: boolean | "suppress-warning" | undefined;
                INSTANCE_SCOPED_SLOTS?: boolean | "suppress-warning" | undefined;
                INSTANCE_ATTRS_CLASS_STYLE?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_FN?: boolean | "suppress-warning" | undefined;
                OPTIONS_DATA_MERGE?: boolean | "suppress-warning" | undefined;
                OPTIONS_BEFORE_DESTROY?: boolean | "suppress-warning" | undefined;
                OPTIONS_DESTROYED?: boolean | "suppress-warning" | undefined;
                WATCH_ARRAY?: boolean | "suppress-warning" | undefined;
                PROPS_DEFAULT_THIS?: boolean | "suppress-warning" | undefined;
                V_ON_KEYCODE_MODIFIER?: boolean | "suppress-warning" | undefined;
                CUSTOM_DIR?: boolean | "suppress-warning" | undefined;
                ATTR_FALSE_VALUE?: boolean | "suppress-warning" | undefined;
                ATTR_ENUMERATED_COERCION?: boolean | "suppress-warning" | undefined;
                TRANSITION_CLASSES?: boolean | "suppress-warning" | undefined;
                TRANSITION_GROUP_ROOT?: boolean | "suppress-warning" | undefined;
                COMPONENT_ASYNC?: boolean | "suppress-warning" | undefined;
                COMPONENT_FUNCTIONAL?: boolean | "suppress-warning" | undefined;
                COMPONENT_V_MODEL?: boolean | "suppress-warning" | undefined;
                RENDER_FUNCTION?: boolean | "suppress-warning" | undefined;
                FILTERS?: boolean | "suppress-warning" | undefined;
                PRIVATE_APIS?: boolean | "suppress-warning" | undefined;
                MODE?: 2 | 3 | ((comp: import('vue').Component<any, any, any, import('vue').ComputedOptions, import('vue').MethodOptions, {}, any> | null) => 2 | 3) | undefined;
            } | undefined;
            data?: ((this: any, vm: any) => any) | undefined;
            computed?: import('vue').ComputedOptions | undefined;
            methods?: import('vue').MethodOptions | undefined;
            watch?: {
                [x: string]: (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>)) | (string | import('vue').WatchCallback<any, any> | ({
                    handler: string | import('vue').WatchCallback<any, any>;
                } & import('vue').WatchOptions<boolean>))[];
            } | undefined;
            provide?: import('vue').ComponentProvideOptions | undefined;
            inject?: {} | string[] | undefined;
            filters?: Record<string, Function> | undefined;
            mixins?: any[] | undefined;
            extends?: any;
            beforeCreate?: (() => void) | undefined;
            created?: (() => void) | undefined;
            beforeMount?: (() => void) | undefined;
            mounted?: (() => void) | undefined;
            beforeUpdate?: (() => void) | undefined;
            updated?: (() => void) | undefined;
            activated?: (() => void) | undefined;
            deactivated?: (() => void) | undefined;
            beforeDestroy?: (() => void) | undefined;
            beforeUnmount?: (() => void) | undefined;
            destroyed?: (() => void) | undefined;
            unmounted?: (() => void) | undefined;
            renderTracked?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            renderTriggered?: ((e: import('vue').DebuggerEvent) => void) | undefined;
            errorCaptured?: ((err: unknown, instance: import('vue').ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, import('vue').ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}, {}, {}, string, import('vue').ComponentProvideOptions>, {}, {}, "", {}, any> | null, info: string) => boolean | void) | undefined;
            delimiters?: [string, string] | undefined;
            __differentiator?: string | number | symbol | undefined;
            __isBuiltIn?: boolean | undefined;
            __file?: string | undefined;
            __name?: string | undefined;
        } | null;
        data: any;
        events: {
            onHover?: ((store: import('..').IDnDStore) => void) | undefined;
            onLeave?: ((store: import('..').IDnDStore) => void) | undefined;
            onEnd?: ((store: import('..').IDnDStore) => void) | undefined;
        };
    }[]>;
    pointerPosition: {
        current: import('vue').Ref<{
            x: number;
            y: number;
        } | null, import('../types').IPoint | {
            x: number;
            y: number;
        } | null>;
        start: import('vue').Ref<{
            x: number;
            y: number;
        } | null, import('../types').IPoint | {
            x: number;
            y: number;
        } | null>;
        offset: {
            percent: import('vue').Ref<{
                x: number;
                y: number;
            } | null, import('../types').IPoint | {
                x: number;
                y: number;
            } | null>;
            pixel: import('vue').Ref<{
                x: number;
                y: number;
            } | null, import('../types').IPoint | {
                x: number;
                y: number;
            } | null>;
        };
    };
    isDragging: import('vue').ComputedRef<boolean>;
};
