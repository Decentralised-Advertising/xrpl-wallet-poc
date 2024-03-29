import { AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import React, { RefObject } from 'react';

/**
 * We create an explicit first-party interface (rather than just extending
 * from react-aria), so that Storybook can automatically create the controls
 * for us in the playground.
 */
export interface TextFieldProps {
  label?: AriaTextFieldOptions['label'];
  validationState?: AriaTextFieldOptions['validationState'];
  isDisabled?: AriaTextFieldOptions['isDisabled'];
  defaultValue?: AriaTextFieldOptions['defaultValue'];
  value?: AriaTextFieldOptions['value'];
  name?: AriaTextFieldOptions['name'];
  id?: AriaTextFieldOptions['id'];
  placeholder?: AriaTextFieldOptions['placeholder'];
  onChange?: AriaTextFieldOptions['onChange'];
  onBlur?: AriaTextFieldOptions['onBlur'];
  type?: AriaTextFieldOptions['type'];
  leftIcon?: JSX.Element;
  trailingButton?: JSX.Element;
  infoText?: string;
  inputRef?: RefObject<HTMLInputElement>;
  autoFocus?: AriaTextFieldOptions['autoFocus'];
  size?: 'small' | 'medium';
}

export const TextField = (props: TextFieldProps) => {
  const { labelProps, inputProps } = useTextField(props, props.inputRef!);

  // tailwind forms plugin needs an explicit type="text" for text inputs
  if (!inputProps.type) {
    inputProps.type = 'text';
  }

  return (
    <div>
      {props.label && (
        <label
          className="block text-sm font-medium leading-5 text-gray-500"
          {...labelProps}
        >
          {props.label}
        </label>
      )}
      <div
        className={`relative rounded-md shadow-sm ${
          props.trailingButton ? 'flex' : ''
        } ${props.label ? 'mt-2' : ''}`}
      >
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          {props.leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {React.cloneElement(props.leftIcon, {
                className: `${props.size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} ${
                  props.validationState === 'invalid'
                    ? 'text-red-900'
                    : 'text-gray-400'
                }`,
              })}
            </div>
          )}

          <input
            className={`border-gray-300 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 placeholder-gray-400 text-black py-3 px-4 block w-full transition ease-in-out duration-150 ${
              props.trailingButton ? 'rounded-none rounded-l-md' : 'rounded-md'
            } ${
              props.validationState === 'invalid'
                ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red pr-12'
                : ''
            } ${props.validationState === 'valid' ? 'pr-12' : ''} ${
              props.isDisabled
                ? 'cursor-not-allowed bg-gray-100 text-gray-500'
                : ''
            } ${
              !props.leftIcon ? '' : props.size === 'small' ? 'pl-9' : 'pl-10'
            } ${props.trailingButton ? 'border-r-0' : ''} ${
              props.size === 'small' ? 'text-sm h-11' : ''
            }`}
            ref={props.inputRef}
            {...inputProps}
          />

          {props.validationState === 'invalid' && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {props.validationState === 'valid' && (
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>

        {props.trailingButton && (
          <div
            className={`bg-white border-t border-r border-b border-gray-300 rounded-r-md ${
              props.validationState === 'invalid'
                ? 'border-red-300 focus:border-red-300 focus:shadow-outline-red'
                : ''
            }`}
            style={{ padding: '6px 6px 6px 10px' }}
          >
            {React.cloneElement(props.trailingButton)}
          </div>
        )}
      </div>
      {props.infoText && props.validationState !== 'invalid' && (
        <p className="mt-3 text-xs text-gray-400 ml-1" id="email-description">
          {props.infoText}
        </p>
      )}
    </div>
  );
};

TextField.defaultProps = {
  size: 'medium',
};
