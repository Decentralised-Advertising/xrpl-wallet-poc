import { joiResolver } from '@hookform/resolvers';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { TextField } from '@xrpl-wallet-poc/shared/components/text-field';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface LoginProps {
  hasPrivateMessageBar: boolean;
}

export function Login({ hasPrivateMessageBar }: LoginProps) {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, errors, setError, control } = useForm({
    resolver: joiResolver(
      Joi.object({
        password: Joi.string().required(),
      })
    ),
  });

  const privateMessageBarHeight = '42px';

  async function onPasswordSubmit(formData: { password: string }) {
    setIsSubmitting(true);

    try {
      await auth.unlock(formData.password);

      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setError('password', {
        type: 'incorrectPassword',
      });
    }
  }

  return (
    <div
      className="login-background h-screen w-screen"
      data-cy="login-container"
      style={{
        width: '100vw',
        height: hasPrivateMessageBar
          ? `calc(100vh - ${privateMessageBarHeight})`
          : '100vh',
      }}
    >
      <header className="pt-16 flex justify-center items-center lg:pt-48">
        {/* DA Logo SVG */}
        <svg
          className="h-10 w-auto fill-current text-gray-800"
          viewBox="0 0 169.33 107.16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g strokeWidth=".265">
            <path
              d="M97.209 16.798L106.36.968l60.935 105.542-83.113-.158s42.093-35.357 13.025-89.557zM.858.943v105.414l35.973-.052s51.153-.44 51.153-52.437C87.984.404 34.424.81 34.424.81z"
              strokeWidth=".1897082"
            />
          </g>
        </svg>
      </header>
      <main className="py-12 px-8">
        <div className="overflow-hidden max-w-3xl m-auto">
          <form onSubmit={handleSubmit(onPasswordSubmit)}>
            <div className="">
              <div className="px-8 py-5">
                <Controller
                  control={control}
                  name="password"
                  defaultValue=""
                  render={({ onChange, onBlur, value, name, ref }) => {
                    return (
                      <TextField
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby="password-error"
                        autoFocus={true}
                        value={value}
                        name={name}
                        onChange={onChange}
                        onBlur={onBlur}
                        inputRef={ref}
                        infoText="All of your identities are encrypted locally on your device and your password is never shared with, or stored on, our servers."
                        isDisabled={isSubmitting}
                        validationState={
                          errors.password ? 'invalid' : undefined
                        }
                        trailingButton={
                          <button
                            type="submit"
                            className="h-full -ml-px relative inline-flex items-center px-4 py-2 border border-teal-400 text-sm leading-5 font-medium rounded-sm bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-500 hover:to-blue-600 text-white justify-center transition ease-in-out duration-150 focus:outline-none focus:shadow-outline-blue focus:border-blue-300"
                          >
                            <svg
                              className="text-white h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                        }
                      />
                    );
                  }}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" id="password-error">
                    {errors.password.type === 'incorrectPassword'
                      ? 'Incorrect password, please make sure Caps Lock is turned off'
                      : 'Your password is required'}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
