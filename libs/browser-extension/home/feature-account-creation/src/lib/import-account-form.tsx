import { joiResolver } from '@hookform/resolvers';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { Button } from '@xrpl-wallet-poc/shared/components/button';
import { Spinner } from '@xrpl-wallet-poc/shared/components/spinner';
import { TextField } from '@xrpl-wallet-poc/shared/components/text-field';
import { delay } from '@xrpl-wallet-poc/shared/utils';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export function ImportAccountForm() {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, errors, control, setError } = useForm({
    resolver: joiResolver(
      Joi.object({
        mnemonic: Joi.string().required(),
        existingEncryptedData: Joi.string().optional(), // user may or may not have existing encrypted data
        password: Joi.string().required(),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
      })
    ),
  });

  async function onSubmit(formData: {
    existingEncryptedData: string;
    mnemonic: string;
    password: string;
  }) {
    try {
      setIsSubmitting(true);

      /**
       * User has provided a mnemonic and encrypted data, but the data
       * cannot be decrypted
       */
      if (
        formData.existingEncryptedData &&
        !auth.isValidMnemonicAndDataCombination(
          formData.existingEncryptedData,
          formData.mnemonic
        )
      ) {
        setIsSubmitting(false);
        setError('existingEncryptedData', {
          type: 'failedDecryption',
        });
        return;
      }

      await auth.importExistingAccount(
        formData.mnemonic,
        formData.password,
        formData.existingEncryptedData
      );

      await delay(2000);

      setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
      setError('existingEncryptedData', {
        type: 'failedParsing',
      });
    }
  }

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="text-5xl font-extrabold leading-tight text-gray-900 text-center">
        Import Existing Account
      </h1>
      <p className="mt-4 text-gray-600 text-lg text-center">
        If you are migrating existing encrypted data, you can provide it now, or
        any time later within the Settings section.
      </p>
      <div className="mt-8 sm:mt-12 lg:mt-16">
        <div className="relative max-w-2xl m-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white p-8 space-y-8">
                <div>
                  <Controller
                    control={control}
                    name="mnemonic"
                    defaultValue=""
                    render={({ ref, ...controllerProps }) => {
                      return (
                        <TextField
                          label="Mnemonic Seed Phrase"
                          type="password"
                          placeholder=""
                          autoFocus={true}
                          inputRef={ref}
                          {...controllerProps}
                          aria-invalid={errors.mnemonic ? 'true' : 'false'}
                          aria-describedby="mnemonic-error"
                          validationState={
                            errors.mnemonic ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors.mnemonic && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="mnemonic-error"
                    >
                      You must create a password in order to encrypt the
                      Identity
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="existingEncryptedData"
                    render={({ ref, ...controllerProps }) => {
                      return (
                        <TextField
                          label="(Optional) Existing Encrypted Data"
                          type="text"
                          placeholder=""
                          autoFocus={false}
                          inputRef={ref}
                          {...controllerProps}
                          aria-invalid={
                            errors.existingEncryptedData ? 'true' : 'false'
                          }
                          aria-describedby="existing-encrypted-data-error"
                          validationState={
                            errors.existingEncryptedData ? 'invalid' : undefined
                          }
                          infoText="If you are migrating existing encrypted data, you can provide it now, or any time later within the Settings section of your account."
                        />
                      );
                    }}
                  />
                  {errors.existingEncryptedData && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="existing-encrypted-data-error"
                    >
                      {JSON.stringify(errors.existingEncryptedData)}
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="password"
                    defaultValue=""
                    render={({ ref, ...controllerProps }) => {
                      return (
                        <TextField
                          label="New Password"
                          type="password"
                          placeholder=""
                          autoFocus={false}
                          inputRef={ref}
                          {...controllerProps}
                          aria-invalid={errors.password ? 'true' : 'false'}
                          aria-describedby="password-error"
                          validationState={
                            errors.password ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors.password && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="password-error"
                    >
                      You must create a password in order to encrypt the
                      Identity
                    </p>
                  )}
                </div>

                <div>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    defaultValue=""
                    render={({ ref, ...controllerProps }) => {
                      return (
                        <TextField
                          label="Confirm Password"
                          type="password"
                          placeholder=""
                          inputRef={ref}
                          {...controllerProps}
                          aria-invalid={
                            errors.confirmPassword ? 'true' : 'false'
                          }
                          aria-describedby="confirm-password-error"
                          validationState={
                            errors.confirmPassword ? 'invalid' : undefined
                          }
                        />
                      );
                    }}
                  />
                  {errors.confirmPassword && (
                    <p
                      className="mt-2 text-sm text-red-600"
                      id="confirm-password-error"
                    >
                      {errors.confirmPassword.type === 'any.required' &&
                        'Please confirm the password in order to encrypt the Identity'}
                      {errors.confirmPassword.type === 'any.only' &&
                        'This does not currently match your given password'}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-8 py-5 sm:flex sm:flex-row-reverse">
                <Button
                  type="submit"
                  variant="primary"
                  size="medium"
                  isDisabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex flex-row">
                      <span style={{ marginTop: '2px' }}>
                        <Spinner size="small" />
                      </span>
                      <span className="ml-4">Validating Data...</span>
                    </div>
                  ) : (
                    <>Import Data</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
