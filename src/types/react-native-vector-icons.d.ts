declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import * as React from 'react';
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: any;
    [key: string]: any;
  }
  const Icon: React.ComponentType<IconProps>;
  export default Icon;
}
