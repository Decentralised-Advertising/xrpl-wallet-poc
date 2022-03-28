import { joiResolver } from '@hookform/resolvers';
import { Account, useAuth } from '@xrpl-wallet-poc/browser-extension/hooks';
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

interface RenameAccountModalProps {
  identity: Account;
  titleProps: ModalTitleProps;
  closeModal: () => void;
}

export function RenameAccountModal({
  identity,
  titleProps,
  closeModal,
}: RenameAccountModalProps) {
  const auth = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, errors, control } = useForm({
    resolver: joiResolver(
      Joi.object({
        identityName: Joi.string().required(),
      })
    ),
  });

  async function onSubmit(formData: { identityName: string }) {
    setIsSubmitting(true);

    await delay(1000);

    await auth.updateAccount(identity, { name: formData.identityName });
    setIsSubmitting(false);
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalDialogHeader
        titleProps={titleProps}
        title="Rename Identity"
        subtitle="You can update the name used to identity the selected Public and Private key pair, but not the keys themselves."
      />

      <ModalDialogBody>
        <div className="">
          <Controller
            control={control}
            name="identityName"
            defaultValue={identity.name}
            render={({ onChange, onBlur, value, name, ref }) => {
              return (
                <TextField
                  type="text"
                  label="Identity Name"
                  placeholder="My Awesome Identity"
                  aria-invalid={errors.identityName ? 'true' : 'false'}
                  aria-describedby="identity-name-error"
                  autoFocus={true}
                  value={value}
                  name={name}
                  onChange={onChange}
                  onBlur={onBlur}
                  inputRef={ref}
                  isDisabled={isSubmitting}
                  validationState={errors.identityName ? 'invalid' : undefined}
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
                <span className="ml-4">Updating...</span>
              </div>
            ) : (
              <>Update Identity</>
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
