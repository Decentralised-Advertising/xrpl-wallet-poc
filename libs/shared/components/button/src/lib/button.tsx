import React, { ButtonHTMLAttributes, useRef } from 'react';
import { useButton } from '@react-aria/button';
import { PressEvents } from '@react-types/shared';

export interface ButtonProps {
  children: JSX.Element | string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  /**
   * Colour/action-type variant for the button
   */
  variant: 'primary' | 'secondary' | 'dark' | 'light' | 'cancel' | 'danger';
  /**
   * Range of possible sizes for the button
   */
  size: 'small' | 'medium';
  /**
   * Normalized handler function for clicks/presses across
   * different device types
   */
  onPress?: PressEvents['onPress'];
  /**
   * Whether or not the button is disabled
   */
  isDisabled?: boolean;
  /**
   * Custom className modifications - USE SPARINGLY
   */
  className?: string;
}

/**
 * An accessible wrapper around a native `<button>` element which has pre-styled variants.
 */
export const Button = (props: ButtonProps) => {
  const ref = useRef(null);
  const { buttonProps } = useButton(props, ref);
  const { children } = props;

  let variantColorClasses = '';
  switch (props.variant) {
    case 'primary':
      variantColorClasses =
        'shadow bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 border-none text-white focus:outline-none focus:border-teal-500 focus:shadow-outline-teal active:bg-teal-600';
      break;
    case 'secondary':
      variantColorClasses =
        'shadow bg-gray-300 hover:bg-gray-400 border-none text-gray-800 focus:outline-none focus:border-gray-500 focus:shadow-outline-gray active:bg-gray-600';
      break;
    case 'dark':
      variantColorClasses =
        'shadow bg-gray-800 hover:bg-gray-700 border-none text-white focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:bg-gray-900';
      break;
    case 'light':
      variantColorClasses =
        'shadow bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-gray-500 focus:outline-none focus:border-gray-600 focus:shadow-outline-gray active:text-gray-800 active:bg-gray-50';
      break;
    case 'cancel':
      variantColorClasses =
        'bg-transparent hover:bg-gray-100 border-none text-gray-700 focus:outline-none focus:border-gray-100 focus:shadow-outline-gray active:bg-gray-100';
      break;
    case 'danger':
      variantColorClasses =
        'shadow bg-red-100 hover:bg-red-50 border-none text-red-700 focus:outline-none focus:border-red-300 focus:shadow-outline-red active:bg-red-200';
      break;
  }

  let sizeClasses = '';
  switch (props.size) {
    case 'small':
      sizeClasses = 'px-4 py-2.5 h-10 text-xs leading-4 font-medium';
      break;
    case 'medium':
      sizeClasses = 'px-5 py-2.5 text-sm leading-6 font-medium';
      break;
  }

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={`${variantColorClasses} ${sizeClasses} border border-transparent rounded inline-flex items-center justify-center transition ease-in-out duration-150 ${
        props.isDisabled ? 'cursor-not-allowed opacity-50' : ''
      } ${props.className ? props.className : ''}`}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  variant: 'primary',
  size: 'medium',
};
