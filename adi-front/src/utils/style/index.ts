import { getContrast } from 'polished';

export const chooseColorByContrast = (background: string, primary: string, secondary: string): string =>
    getContrast(background, primary) > 1 ? secondary : primary;

export const defaultBoxShadow = (): string => '5px 5px 5px 0px rgba(0,0,0,0.2)';
