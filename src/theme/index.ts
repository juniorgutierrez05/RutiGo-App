/**
 * RutiGo Unified Design System Theme
 */
import { colors } from './colors';
import { typography } from './typography';
import { radii } from './radii';
import { shadows } from './shadows';

export const theme = {
  colors,
  typography,
  radii,
  shadows,
};

export type Theme = typeof theme;
export { colors, typography, radii, shadows };
export default theme;
