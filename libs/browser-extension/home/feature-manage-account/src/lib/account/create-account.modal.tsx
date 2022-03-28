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

interface CreateAccountModalProps {
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function CreateAccountModal({
  titleProps,
  closeModal,
}: CreateAccountModalProps) {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, errors, control } = useForm({
    resolver: joiResolver(
      Joi.object({
        accountName: Joi.string().required(),
      })
    ),
  });

  async function onSubmit(formData: { accountName: string }) {
    setIsSubmitting(true);

    await delay(1500);

    await auth.createAccount({
      name: formData.accountName,
    });

    setIsSubmitting(false);
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Create Account"
        subtitle="A unique Public and Private key pair will be generated in your browser and stored locally using the name you specify."
      />

      <ModalDialogBody>
        <div className="">
          <Controller
            control={control}
            name="accountName"
            defaultValue=""
            render={({ onChange, onBlur, value, name, ref }) => {
              return (
                <TextField
                  type="text"
                  label="Account Name"
                  placeholder="My Awesome Account"
                  aria-invalid={errors.accountName ? 'true' : 'false'}
                  aria-describedby="account-name-error"
                  autoFocus={true}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  isDisabled={isSubmitting}
                  validationState={errors.accountName ? 'invalid' : undefined}
                />
              );
            }}
          />
          {errors.accountName && (
            <p className="mt-2 text-sm text-red-600" id="account-name-error">
              You must provide a name for the Account
            </p>
          )}
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
                <span className="ml-4">Generating Keys...</span>
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
                Generate Keys
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
