/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { useAdministrationSettings } from '@cloudbeaver/core-administration';
import { FormBox, FormBoxElement, FormGroup, SubmittingForm, InputField, useMapResource, FieldCheckbox, Switch, FormFieldDescription, Button } from '@cloudbeaver/core-blocks';
import type { TabContainerPanelComponent } from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';

import { NetworkHandlerResource, SSH_TUNNEL_ID } from '../../NetworkHandlerResource';
import type { IConnectionFormTabProps } from '../ConnectionFormService';
import { useConnectionData } from '../useConnectionData';

export const SSH: TabContainerPanelComponent<IConnectionFormTabProps> = observer(function SSH({
  data,
  form,
}) {
  const [loading, setLoading] = useState(false);
  const initialConfig = data.info?.networkHandlersConfig.find(handler => handler.id === SSH_TUNNEL_ID);
  const { credentialsSavingEnabled } = useAdministrationSettings();

  useConnectionData(data, data => {
    if (!data.config.networkHandlersConfig) {
      data.config.networkHandlersConfig = [];
    }

    if (!data.config.networkHandlersConfig.some(state => state.id === SSH_TUNNEL_ID)) {
      data.config.networkHandlersConfig.push({
        id: SSH_TUNNEL_ID,
        enabled: false,
        password: '',
        savePassword: true,
        userName: '',
        ...initialConfig,

        properties: {
          port: 22,
          host: '',
          ...initialConfig?.properties,
        },
      });
    }
  });

  const state = data.config.networkHandlersConfig!.find(state => state.id === SSH_TUNNEL_ID)!;

  const resource = useMapResource(NetworkHandlerResource, SSH_TUNNEL_ID, {
    onData: handler => {
      if (Object.keys(state).length === 0) {
        for (const property of handler.properties) {
          if (!property.features.includes('password')) {
            state.properties[property.id!] = property.value;
          }
        }
      }
    },
  });

  const testConnection = async () => {
    setLoading(true);
    await resource.resource.test(state);
    setLoading(false);
  };

  const translate = useTranslate();
  const disabled = form.form.disabled || loading;
  const enabled = state.enabled || false;
  const passwordFilled = (initialConfig?.password === null && state.password !== '') || (state.password?.length || 0) > 0;
  let passwordHint = '';

  if (initialConfig?.password === '') {
    passwordHint = '••••••';
  }

  return (
    <SubmittingForm onSubmit={form.save}>
      <FormBox>
        <FormBoxElement max>
          <FormGroup><br /></FormGroup>
          <FormGroup>
            <Switch
              name="enabled"
              state={state}
              mod={['primary']}
              disabled={disabled}
            >
              {translate('connections_network_handler_ssh_tunnel_enable')}
            </Switch>
          </FormGroup>
        </FormBoxElement>
        <FormBoxElement>
          <FormGroup>
            <InputField
              type="text"
              name="host"
              state={state.properties}
              disabled={disabled || !enabled}
              mod='surface'
            >
              {translate('connections_network_handler_ssh_tunnel_host')}
            </InputField>
          </FormGroup>
          <FormGroup>
            <InputField
              type="number"
              name="port"
              state={state.properties}
              disabled={disabled || !enabled}
              mod='surface'
            >
              {translate('connections_network_handler_ssh_tunnel_port')}
            </InputField>
          </FormGroup>
        </FormBoxElement>
        <FormBoxElement>
          <FormGroup>
            <InputField
              type="text"
              name="userName"
              state={state}
              disabled={disabled || !enabled}
              mod='surface'
            >
              {translate('connections_network_handler_ssh_tunnel_user')}
            </InputField>
          </FormGroup>
          <FormGroup>
            <InputField
              type="password"
              name="password"
              placeholder={passwordHint}
              state={state}
              disabled={disabled || !enabled}
              mod='surface'
            >
              {translate('connections_network_handler_ssh_tunnel_password')}
            </InputField>
          </FormGroup>
          {credentialsSavingEnabled && (
            <FormGroup>
              <FieldCheckbox
                name="savePassword"
                value={SSH_TUNNEL_ID + ' savePassword'}
                state={state}
                checkboxLabel={translate('connections_network_handler_ssh_tunnel_save_password')}
                disabled={disabled || !enabled}
                mod='surface'
              />
            </FormGroup>
          )}
          <FormGroup>
            <FormFieldDescription>
              <Button
                type='button'
                mod={['outlined']}
                disabled={disabled || !enabled || !passwordFilled}
                onClick={testConnection}
              >
                {translate('connections_network_handler_test')}
              </Button>
            </FormFieldDescription>
          </FormGroup>
        </FormBoxElement>
      </FormBox>
    </SubmittingForm>
  );
});
