// Styles exports
export { theme, type Theme, type ThemeColors, type ThemeSpacing, type ThemeBorderRadius, type ThemeShadows } from './theme';
export { GlobalStyles } from './GlobalStyles';
export { ThemeProvider } from './ThemeProvider';
export { StyledComponentsRegistry } from './StyledComponentsRegistry';
export * from './pages';

// Accessibility mixins
export {
  focusVisibleMixin,
  touchTargetMixin,
  srOnlyMixin,
  reducedMotionMixin,
  interactiveElementMixin,
  highContrastMixin,
} from './mixins';
