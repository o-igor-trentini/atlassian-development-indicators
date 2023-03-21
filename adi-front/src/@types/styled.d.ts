import 'styled-components';
import { ThemeType } from '@/styles/themes';

declare module 'styled-components' {
    // eslint-disable-next-line
    export interface DefaultTheme extends ThemeType {}
}
