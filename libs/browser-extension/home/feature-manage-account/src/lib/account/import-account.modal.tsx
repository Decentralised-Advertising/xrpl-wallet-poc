import { joiResolver } from '@hookform/resolvers';
import { useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
import { Button } from '@xrpl-wallet-poc/shared/components/button';
import {
  ModalDialogBody,
  ModalDialogFooter,
  ModalDialogHeader,
  ModalTitleProps,
} from '@xrpl-wallet-poc/shared/components/modal-dialog';
import { Spinner } from '@xrpl-wallet-poc/shared/components/spinner';
import { TextField } from '@xrpl-wallet-poc/shared/components/text-field';
import { delay } from '@xrpl-wallet-poc/shared/utils';
import Joi from 'joi';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface ImportAccountModalProps {
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function ImportAccountModal({
  titleProps,
  closeModal,
}: ImportAccountModalProps) {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, errors, control, setError } = useForm({
    resolver: joiResolver(
      Joi.object({
        name: Joi.string().required(),
        seed: Joi.string().required(),
      })
    ),
  });

  async function onSubmit(formData: { name: string; seed: string }) {
    setIsSubmitting(true);

    await delay(1500);

    try {
      await auth.createAccount({
        name: formData.name,
        seed: formData.seed,
      });
      setIsSubmitting(false);
      closeModal();
    } catch {
      setIsSubmitting(false);
      setError('seed', {
        type: 'invalidSeed',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Import Identity"
        subtitle="If you have an existing Private key, a corresponding Public Key will be generated in your browser and stored locally using the name you specify."
      />

      <ModalDialogBody>
        <div className="pb-4 space-y-8">
          <div className="">
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ onChange, onBlur, value, name, ref }) => {
                return (
                  <TextField
                    type="text"
                    label="Account Name"
                    placeholder="My Awesome Identity"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby="identity-name-error"
                    autoFocus={true}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputRef={ref}
                    isDisabled={isSubmitting}
                    validationState={errors.name ? 'invalid' : undefined}
                  />
                );
              }}
            />
            {errors.identityName && (
              <p className="mt-2 text-sm text-red-600" id="identity-name-error">
                You must provide a name for the Identity
              </p>
            )}
          </div>

          <div className="">
            <Controller
              control={control}
              name="seed"
              defaultValue=""
              render={({ onChange, onBlur, value, name, ref }) => {
                return (
                  <TextField
                    type="password"
                    label="Seed"
                    placeholder="**********"
                    aria-invalid={errors.seed ? 'true' : 'false'}
                    aria-describedby="private-key-error"
                    autoFocus={false}
                    value={value}
                    name={name}
                    onChange={onChange}
                    onBlur={onBlur}
                    inputRef={ref}
                    isDisabled={isSubmitting}
                    validationState={errors.seed ? 'invalid' : undefined}
                  />
                );
              }}
            />
            {errors.seed && (
              <p className="mt-2 text-sm text-red-600" id="private-key-error">
                {errors.seed.type === 'invalidSeed'
                  ? 'Please ensure that this is a valid seed'
                  : 'A seed value is required'}
              </p>
            )}
          </div>
        </div>
      </ModalDialogBody>

      <ModalDialogFooter>
        <span className="ml-2">
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
                <span className="ml-4">Generating Public Key...</span>
              </div>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                Generate Public Key
              </>
            )}
          </Button>
        </span>
        <Button variant="cancel" size="medium" onPress={closeModal}>
          Cancel
        </Button>
      </ModalDialogFooter>
    </form>
  );
}
