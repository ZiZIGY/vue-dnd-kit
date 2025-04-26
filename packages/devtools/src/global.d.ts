interface Window {
  __VUE__?: any;
  __VUE_DEVTOOLS_GLOBAL_HOOK__?: {
    Vue?: any;
    enabled?: boolean;
    plugins?: Array<any>;
    emit?: (event: string, ...args: any[]) => void;
    on?: (event: string, fn: Function) => void;
    once?: (event: string, fn: Function) => void;
    off?: (event: string, fn: Function) => void;
  };
}
