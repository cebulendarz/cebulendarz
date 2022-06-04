import { DefaultTheme } from '@mui/private-theming';

// TODO: tmp, use types for mui theme https://mui.com/material-ui/customization/theming/#custom-variables
export interface AppTheme extends DefaultTheme {
  palette: {
    primary: {
      main: string;
    };
    secondary: {
      main: string;
    };
  };
}
