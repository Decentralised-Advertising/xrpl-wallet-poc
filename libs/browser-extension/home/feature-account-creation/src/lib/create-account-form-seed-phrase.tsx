import { joiResolver } from '@hookform/resolvers';
import { generateMnemonic } from '@xrpl-wallet-poc/browser-extension/utils';
import { Button } from '@xrpl-wallet-poc/shared/components/button';
import Joi from 'joi';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MnemonicViewer } from '@xrpl-wallet-poc/browser-extension/components';

interface CreateAccountFormSeedPhraseProps {
  onConfirmedBackup: (mnemonic: string) => void;
}

export function CreateAccountFormSeedPhrase(
  props: CreateAccountFormSeedPhraseProps
) {
  const [mnemonic] = useState(generateMnemonic());

  const { handleSubmit, register, watch } = useForm({
    resolver: joiResolver(
      Joi.object({
        confirmBackup: Joi.boolean().required(),
      })
    ),
  });

  const confirmBackup = watch('confirmBackup');

  function onConfirmedBackup() {
    props.onConfirmedBackup(mnemonic);
  }

  return (
    <form onSubmit={handleSubmit(onConfirmedBackup)}>
      <div className="space-y-8 pb-8">
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-3xl font-extrabold leading-tight text-gray-900">
            Seed Phrase
          </h2>
          <p className="mt-3 text-gray-600 text-sm">
            Your secret seed phrase makes it easy to backup and restore your
            account.{' '}
            <span className="mt-3 text-gray-600 text-sm font-bold">
              Store your phrase in a secure password manager like 1Password and
              never disclose it to anyone.
            </span>
          </p>
        </div>

        <div className="px-8">
          <MnemonicViewer
            decryptedMnemonic={mnemonic}
            showCopyButton={true}
            showPlaceholder={true}
          />
        </div>

        <div className="px-8">
          <div className="flex items-center">
            <input
              name="confirmBackup"
              type="checkbox"
              className="focus:ring-blue-200 border-gray-300 rounded h-4 w-4 text-teal-500 transition duration-150 ease-in-out"
              ref={register}
            />
            <label
              htmlFor="confirmBackup"
              className="ml-2 block text-sm leading-5 text-gray-900"
            >
              I confirm I have securely backed up my seed phrase
            </label>
          </div>
        </div>

        <div className="px-8 flex justify-end">
          <Button
            isDisabled={!confirmBackup}
            type="submit"
            size="medium"
            variant="primary"
          >
            Next Step
          </Button>
        </div>
      </div>
    </form>
  );
}
