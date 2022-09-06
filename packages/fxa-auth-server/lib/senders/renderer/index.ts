/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { DOMLocalization, Localization } from '@fluent/dom';
import {
  RendererBindings,
  TemplateContext,
  RendererContext,
  TemplateValues,
} from './bindings';
import Localizer, { FtlIdMsg } from '../../l10n';
import { FluentBundle, FluentResource } from '@fluent/bundle';

const RTL_LOCALES = [
  'ar',
  'ckb',
  'dv',
  'he',
  'ks',
  'ps',
  'fa',
  'syr',
  'ur',
  'ug',
];

export interface GlobalTemplateValues {
  subject: FtlIdMsg;
  action?: FtlIdMsg;
}

class Renderer extends Localizer {
  protected readonly bindings: RendererBindings;

  constructor(bindings: RendererBindings) {
    super(bindings);
    this.bindings = bindings;
  }

  async localizeAndRender(
    l10n: DOMLocalization | Localization | undefined,
    string: FtlIdMsg,
    context: RendererContext
  ) {
    // l10n will only be undefined in tests
    if (!l10n) {
      l10n = (await super.setupLocalizer(context.acceptLanguage)).l10n;
    }

    const localizedString =
      (await l10n.formatValue(string.id, flattenNestedObjects(context))) ||
      string.message;
    return localizedString.includes('<%')
      ? this.bindings.renderEjs(localizedString, context)
      : localizedString;
  }

  /**
   * Renders and localizes an MJML/EJS email.
   * @param templateContext Contains either values sent through mailer.send or mock values from Storybook
   * @returns html HTML transformed from MJML that is rendered through EJS and localized
   * @returns text Plaintext rendered through EJS and localized
   * @returns subject Localized subject, for mailer use
   */
  async renderEmail(templateContext: TemplateContext) {
    const { acceptLanguage, template, layout } = templateContext;
    const { l10n, selectedLocale } = await super.setupDomLocalizer(
      acceptLanguage
    );

    function getFtlMsg(ftlId: keyof FtlIdMsg, fallback: keyof FtlIdMsg) {
      // TODO (rough pseudo code, actual functionality may differ)
      // Also see https://github.com/mozilla/fxa/pull/11530/files
      //
      // 1) Grab translated message from Fluent bundle based on locale and ftlId
      // 2) If message contains `VariableReferences`, supply them with matching `templateValues`
      // 3) If error or no `VariableReferences`, then `return fallback;`
      //
      // The linked PR uses the 'en' bundle as a single source of truth for variable presence.
      // I'm not sure that's more preferable here given we aren't using `l10n-data-args`.

      // Fake bundle test for `automatedEmailChangePassword` to show fluent bundle vs DOM
      // Looks weird, but Fluent needs these spaces to be dedented
      const res = new FluentResource(`
-brand-mozilla = Foxkeh

automated-email-change-2 = Lorem ipsum @fluent/bundle test <a class="link-blue" href="{$passwordChangeLink}">totam rem aperiam</a>. Nemo enim ipsam quia <a class="link-blue" href="{$supportUrl}">{ -brand-mozilla } Neque</a>.

automated-email-change-3 = Lorem ipsum @fluent/dom test <a data-l10n-name="passwordChangeLink">totam rem aperiam</a>. Nemo enim ipsam voluptatem quia <a data-l10n-name="supportUrl">{ -brand-mozilla } Neque</a>.
`);
      const bundle = new FluentBundle(['en']);
      bundle.addResource(res);
      const bundleMsg = bundle.getMessage(ftlId);

      function formatMsg() {
        // using fluentDOM - if `data-l10n-name` is provided, can we use `formatValue` and make this work?
        // if (
        // 'data-l10n-name' is provided anywhere?
        // ) {
        // do stuff with this
        //   return l10n.formatValue(ftlId, templateContext);
        // }
        return bundle.formatPattern(
          // @ts-ignore TODO: fix type
          bundleMsg.value,
          templateContext
        );
      }

      return bundleMsg && bundleMsg.value && bundleMsg.value !== ftlId
        ? formatMsg()
        : fallback;
    }

    const context = {
      ...templateContext.templateValues,
      ...templateContext,
      cssPath: this.bindings.opts.templates.cssPath,
      // subject will always be set later but initialize with a string to make TS happy
      subject: '',
      //@ts-ignore TODO: add to RendererContext type
      getFtlMsg,
    } as RendererContext;

    if (template !== '_storybook') {
      /*
       * 'Subject' and 'action' must be localized BEFORE the email is rendered because:
       * 1) These values are needed in layout files and aren't easily localized, since
       * `subject` goes inside `mj-title` and `action` goes in a script in `metadata.mjml`
       * 2) We need to return a localized `subject` back to the mailer
       */
      const { subject, action } = await this.getGlobalTemplateValues(context);
      const localizeAndRenderSubject = this.localizeAndRender(
        l10n,
        subject,
        context
      );
      if (action) {
        const [localizedSubject, localizedAction] = await Promise.all([
          localizeAndRenderSubject,
          this.localizeAndRender(l10n, action, context),
        ]);

        context.subject = localizedSubject;
        context.action = localizedAction;
      } else {
        context.subject = await localizeAndRenderSubject;
      }
    }

    const { text, rootElement } = await this.bindings.renderTemplate(
      template,
      context,
      layout
    );

    l10n.connectRoot(rootElement);
    await l10n.translateRoots();

    const isLocaleRenderedRtl = RTL_LOCALES.includes(selectedLocale);
    if (isLocaleRenderedRtl) {
      const body = rootElement.getElementsByTagName('body')[0];
      body.classList.add('rtl');
    }

    const localizedPlaintext = await this.localizePlaintext(
      text,
      context,
      l10n
    );

    return {
      html: rootElement.outerHTML,
      text: localizedPlaintext,
      subject: context.subject,
    };
  }

  private async getGlobalTemplateValues(
    context: RendererContext
  ): Promise<GlobalTemplateValues> {
    // We must use 'require' here, 'import' causes an 'unknown file extension .ts'
    // error. Might be a config option to make it work?
    try {
      // make this a switch statement on 'template' if more cases arise?
      if (context.template === 'lowRecoveryCodes') {
        return (
          await require('../emails/templates/lowRecoveryCodes/includes')
        ).getIncludes(context.numberRemaining);
      }
      return require(`../emails/templates/${context.template}/includes.json`);
    } catch (e) {
      throw e;
    }
  }

  protected async localizePlaintext(
    text: string,
    context: TemplateContext | RendererContext,
    l10n?: DOMLocalization | Localization
  ): Promise<string> {
    if (!l10n) {
      l10n = (await super.setupLocalizer(context.acceptLanguage)).l10n;
    }
    const ftlContext = flattenNestedObjects(context);

    const plainTextArr = text.split('\n');
    for (let i in plainTextArr) {
      // match the lines that are of format key = "value" since we will be extracting the key
      // to pass down to fluent
      const { key, val } = splitPlainTextLine(plainTextArr[i]);

      if (key && val) {
        plainTextArr[i] = (await l10n.formatValue(key, ftlContext)) || val;
      }
    }
    // convert back to string and strip excessive line breaks
    return plainTextArr.join('\n').replace(/(\n){2,}/g, '\n\n');
  }
}

const reSplitLine = /(?<key>[a-zA-Z0-9-_]+)\s*=\s*"(?<val>.*)?"/;
export function splitPlainTextLine(plainText: string) {
  const matches = reSplitLine.exec(plainText);
  const key = matches?.groups?.key;
  const val = matches?.groups?.val;

  return { key, val };
}

/*
 * We flatten objects coming from the mailer when localizing because Fluent expects to be passed
 * a simple object containing variable names and their values, not an object containing objects
 *
 * NOTE: if in the future, any template value is an _array_ of objects containing strings needing
 * l10n, we will need to account for those variable names differently to ensure the same EJS
 * variable matches the variable name we pass to Fluent. Right now `subscriptions` containing
 * `productName`s is the only array of objects and since we don't localize `productName`
 * that case isn't handled since we don't need to (yet).
 */
export function flattenNestedObjects(
  context: RendererContext | Record<string, any>
): Record<string, string | number> {
  const flattenedObj = {} as any;

  for (const templateVar in context) {
    const varValue = context[templateVar];
    if (typeof varValue === 'object' && varValue !== null) {
      Object.assign(flattenedObj, flattenNestedObjects(varValue));
    } else {
      flattenedObj[templateVar] = varValue;
    }
  }

  return flattenedObj;
}

export default Renderer;
