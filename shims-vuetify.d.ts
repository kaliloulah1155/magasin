// shims-vuetify.d.ts
declare module "vuetify/types/services/goto" {
  export interface VuetifyGoTo {
    (
      target: Element | number | string,
      options?: VuetifyGoToOptions
    ): Promise<void>;
  }

  export interface VuetifyGoToOptions {
    target?: VuetifyGoToTarget;
    duration?: number;
    offset?: number;
    easing?: VuetifyGoToEasing;
  }

  export type VuetifyGoToTarget = Element | string | VuetifyGoToElementTarget;

  export type VuetifyGoToElementTarget = {
    offset: number;
  } & Exclude<VuetifyGoToOptions, "offset">;

  export type VuetifyGoToEasing = (t: number) => number;
}
