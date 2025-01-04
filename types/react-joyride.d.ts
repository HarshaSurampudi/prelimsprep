declare module "react-joyride" {
  import { Component } from "react";

  export interface Step {
    target: string;
    content: React.ReactNode;
    disableBeacon?: boolean;
    placement?: string;
    title?: string;
    styles?: object;
  }

  export interface Props {
    steps: Step[];
    run: boolean;
    continuous?: boolean;
    showProgress?: boolean;
    showSkipButton?: boolean;
    hideCloseButton?: boolean;
    callback?: (data: any) => void;
    stepIndex?: number;
    styles?: {
      options?: {
        zIndex?: number;
        primaryColor?: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
  }

  export default class ReactJoyride extends Component<Props> {}
}
