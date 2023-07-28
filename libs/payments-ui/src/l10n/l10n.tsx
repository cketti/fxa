import React, { Children, useEffect, useState, ReactNode } from 'react';

import { negotiateLanguages } from '@fluent/langneg';
import { FluentBundle, FluentResource } from '@fluent/bundle';
import { ReactLocalization, LocalizationProvider } from '@fluent/react';

const ftl: Record<string, URL> = {
  'en-US': new URL('./en-US.ftl', import.meta.url),
  fr: new URL('./fr.ftl', import.meta.url),
};

const DEFAULT_LOCALE = 'en-US';
const AVAILABLE_LOCALES = {
  'en-US': 'English',
  fr: 'French',
};

async function fetchMessages(locale: string): Promise<[string, string]> {
  const response = await fetch(String(ftl[locale]));
  const messages = await response.text();
  return [locale, messages];
}

function* lazilyParsedBundles(fetchedMessages: Array<[string, string]>) {
  for (const [locale, messages] of fetchedMessages) {
    const resource = new FluentResource(messages);
    const bundle = new FluentBundle(locale);
    bundle.addResource(resource);
    yield bundle;
  }
}

interface AppLocalizationProviderProps {
  children: ReactNode;
}

export function AppLocalizationProvider(props: AppLocalizationProviderProps) {
  const [currentLocales, setCurrentLocales] = useState([DEFAULT_LOCALE]);
  const [l10n, setL10n] = useState<ReactLocalization | null>(null);

  useEffect(() => {
    changeLocales(navigator.languages as Array<string>);
  }, []);

  async function changeLocales(userLocales: Array<string>) {
    const currentLocales = negotiateLanguages(
      userLocales,
      Object.keys(AVAILABLE_LOCALES),
      { defaultLocale: DEFAULT_LOCALE }
    );
    setCurrentLocales(currentLocales);

    const fetchedMessages = await Promise.all(
      currentLocales.map(fetchMessages)
    );

    const bundles = lazilyParsedBundles(fetchedMessages);
    setL10n(new ReactLocalization(bundles));
  }

  if (l10n === null) {
    return <div>Loading…</div>;
  }

  return (
    <>
      <LocalizationProvider l10n={l10n}>
        {Children.only(props.children)}
      </LocalizationProvider>

      <hr />
      <select
        onChange={(event) => changeLocales([event.target.value])}
        value={currentLocales[0]}
      >
        {Object.entries(AVAILABLE_LOCALES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </>
  );
}
