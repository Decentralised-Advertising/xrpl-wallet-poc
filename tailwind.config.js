// @ts-check
/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore The type information does not match the runtime exports
const { fontFamily } = require('tailwindcss/defaultTheme');
const hexRgb = require('hex-rgb');

function rgba(hex, alpha) {
  const { red, green, blue } = hexRgb(hex);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * TODO: Evaluate on an app by app basis if we should migrate to tailwind UI v2 colors. The below
 * just carries forward the v1 colors for now.
 * Source: https://gist.github.com/adamwathan/24341b9b2490ac99105a2aeecab73b92
 */
const colors = {
  current: 'currentColor',
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',
  gray: {
    50: '#f9fafb',
    100: '#f4f5f7',
    200: '#e5e7eb',
    300: '#d2d6dc',
    400: '#9fa6b2',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#252f3f',
    900: '#161e2e',
  },
  red: {
    50: '#fdf2f2',
    100: '#fde8e8',
    200: '#fbd5d5',
    300: '#f8b4b4',
    400: '#f98080',
    500: '#f05252',
    600: '#e02424',
    700: '#c81e1e',
    800: '#9b1c1c',
    900: '#771d1d',
  },
  orange: {
    50: '#fff8f1',
    100: '#feecdc',
    200: '#fcd9bd',
    300: '#fdba8c',
    400: '#ff8a4c',
    500: '#ff5a1f',
    600: '#d03801',
    700: '#b43403',
    800: '#8a2c0d',
    900: '#73230d',
  },
  yellow: {
    50: '#fdfdea',
    100: '#fdf6b2',
    200: '#fce96a',
    300: '#faca15',
    400: '#e3a008',
    500: '#c27803',
    600: '#9f580a',
    700: '#8e4b10',
    800: '#723b13',
    900: '#633112',
  },
  green: {
    50: '#f3faf7',
    100: '#def7ec',
    200: '#bcf0da',
    300: '#84e1bc',
    400: '#31c48d',
    500: '#0e9f6e',
    600: '#057a55',
    700: '#046c4e',
    800: '#03543f',
    900: '#014737',
  },
  teal: {
    50: '#edfafa',
    100: '#d5f5f6',
    200: '#afecef',
    300: '#7edce2',
    400: '#16bdca',
    500: '#0694a2',
    600: '#047481',
    700: '#036672',
    800: '#05505c',
    900: '#014451',
  },
  blue: {
    50: '#ebf5ff',
    100: '#e1effe',
    200: '#c3ddfd',
    300: '#a4cafe',
    400: '#76a9fa',
    500: '#3f83f8',
    600: '#1c64f2',
    700: '#1a56db',
    800: '#1e429f',
    900: '#233876',
  },
  indigo: {
    50: '#f0f5ff',
    100: '#e5edff',
    200: '#cddbfe',
    300: '#b4c6fc',
    400: '#8da2fb',
    500: '#6875f5',
    600: '#5850ec',
    700: '#5145cd',
    800: '#42389d',
    900: '#362f78',
  },
  purple: {
    50: '#f6f5ff',
    100: '#edebfe',
    200: '#dcd7fe',
    300: '#cabffd',
    400: '#ac94fa',
    500: '#9061f9',
    600: '#7e3af2',
    700: '#6c2bd9',
    800: '#5521b5',
    900: '#4a1d96',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce8f3',
    200: '#fad1e8',
    300: '#f8b4d9',
    400: '#f17eb8',
    500: '#e74694',
    600: '#d61f69',
    700: '#bf125d',
    800: '#99154b',
    900: '#751a3d',
  },
};

module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
  /**
   * TODO: Variants can be removed when we switch to the new tailwind JIT compiler.
   * Most of these are defined in order to carry forward tailwind UI behavior
   */
  variants: {
    extend: {
      fontWeight: ['hover', 'focus'],
      backgroundColor: ['group-focus', 'active'],
      borderColor: ['group-focus'],
      boxShadow: ['group-focus'],
      opacity: ['group-focus'],
      textColor: ['group-focus', 'active'],
      textDecoration: ['group-focus'],
    },
  },
  theme: {
    /**
     * TODO: Remove the need for this explicit override using the v1 values
     * https://tailwindcss.com/docs/upgrading-to-v2#configure-your-font-size-scale-explicitly
     */
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...fontFamily.sans],
        header: ['gilroy-extrabold', ...fontFamily.sans],
        'light-header': ['gilroy-light', ...fontFamily.sans],
      },
      /**
       * TODO: Migrate usage of these to the tailwind aspect-ratio plugin in v2
       * https://tailwindui.com/changes-for-v2
       */
      padding: {
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
        full: '100%',
      },
      /**
       * TODO: Migrate usage to v2 "ring" utilities and remove the need for this extension
       * https://tailwindcss.com/docs/upgrading-to-v2#replace-shadow-outline-and-shadow-xs-with-ring-utilities
       */
      boxShadow: {
        xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
        solid: '0 0 0 2px currentColor',
        outline: `0 0 0 3px ${rgba(colors.blue[400], 0.45)}`,
        'outline-gray': `0 0 0 3px ${rgba(colors.gray[400], 0.45)}`,
        'outline-blue': `0 0 0 3px ${rgba(colors.blue[300], 0.45)}`,
        'outline-teal': `0 0 0 3px ${rgba(colors.teal[300], 0.45)}`,
        'outline-red': `0 0 0 3px ${rgba(colors.red[300], 0.45)}`,
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: colors.teal[500],
              '&:hover': {
                color: colors.teal[600],
              },
            },
          },
        },
      },
    },
    colors,
  },
};
