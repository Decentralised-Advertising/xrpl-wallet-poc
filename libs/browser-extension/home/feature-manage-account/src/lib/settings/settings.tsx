import React from 'react';
import { ExportData } from './export-data';
import { RevealMnemonic } from './reveal-mnemonic';
import { ImportData } from './import-data';

export function ManageAccountSettings() {
  return (
    <div className="pt-9 px-12">
      <header className="mb-12">
        <div className="mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight text-gray-900">
            Settings
          </h1>

          <p className="mt-4 mx-auto text-lg leading-6 text-gray-500">
            Import or export copies of your encrypted data, and reveal your
            mnemonic seed phrase.
          </p>
        </div>
      </header>

      <div className="mb-12 space-y-12">
        <div className="grid grid-cols-2 gap-8">
          <div className="col-span-2">
            <RevealMnemonic />
          </div>

          <div>
            <ExportData />
          </div>

          <div>
            <ImportData />
          </div>
        </div>
      </div>
    </div>
  );
}
