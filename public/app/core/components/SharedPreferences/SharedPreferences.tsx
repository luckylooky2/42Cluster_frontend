import { css } from '@emotion/css';
import React, { PureComponent } from 'react';

import { SelectableValue, getBuiltInThemes, ThemeRegistryItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { config, reportInteraction } from '@grafana/runtime';
import { Preferences as UserPreferencesDTO } from '@grafana/schema/src/raw/preferences/x/preferences_types.gen';
import {
  Button,
  Field,
  FieldSet,
  // Label,
  Select,
  stylesFactory,
  TimeZonePicker,
  WeekStartPicker,
  // FeatureBadge,
} from '@grafana/ui';
// import { DashboardPicker } from 'app/core/components/Select/DashboardPicker';
import { t, Trans } from 'app/core/internationalization';
// import { LANGUAGES } from 'app/core/internationalization/constants';
import { PreferencesService } from 'app/core/services/PreferencesService';
import { changeTheme } from 'app/core/services/theme';

export interface Props {
  resourceUri: string;
  disabled?: boolean;
  preferenceType: 'org' | 'team' | 'user';
  onConfirm?: () => Promise<boolean>;
}

export type State = UserPreferencesDTO;

// function getLanguageOptions(): Array<SelectableValue<string>> {
//   const languageOptions = LANGUAGES.map((v) => ({
//     value: v.code,
//     label: v.name,
//   }));

//   const options = [
//     {
//       value: '',
//       label: t('common.locale.default', 'Default'),
//     },
//     ...languageOptions,
//   ];

//   return options;
// }

export class SharedPreferences extends PureComponent<Props, State> {
  service: PreferencesService;
  themeOptions: SelectableValue[];

  constructor(props: Props) {
    super(props);

    this.service = new PreferencesService(props.resourceUri);
    this.state = {
      theme: '',
      timezone: '',
      weekStart: '',
      language: '',
      queryHistory: { homeTab: '' },
    };

    this.themeOptions = getBuiltInThemes(config.featureToggles.extraThemes).map((theme) => ({
      value: theme.id,
      label: getTranslatedThemeName(theme),
    }));

    // Add default option
    this.themeOptions.unshift({ value: '', label: t('shared-preferences.theme.default-label', 'Default') });
  }

  async componentDidMount() {
    const prefs = await this.service.load();

    this.setState({
      homeDashboardUID: prefs.homeDashboardUID,
      theme: prefs.theme,
      timezone: prefs.timezone,
      weekStart: prefs.weekStart,
      language: prefs.language,
      queryHistory: prefs.queryHistory,
    });
  }

  onSubmitForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const confirmationResult = this.props.onConfirm ? await this.props.onConfirm() : true;

    if (confirmationResult) {
      const { homeDashboardUID, theme, timezone, weekStart, language, queryHistory } = this.state;
      await this.service.update({ homeDashboardUID, theme, timezone, weekStart, language, queryHistory });
      window.location.reload();
    }
  };

  onThemeChanged = (value: SelectableValue<string>) => {
    this.setState({ theme: value.value });

    if (value.value) {
      changeTheme(value.value, true);
    }
  };

  onTimeZoneChanged = (timezone?: string) => {
    if (typeof timezone !== 'string') {
      return;
    }
    this.setState({ timezone: timezone });
  };

  onWeekStartChanged = (weekStart: string) => {
    this.setState({ weekStart: weekStart });
  };

  onHomeDashboardChanged = (dashboardUID: string) => {
    this.setState({ homeDashboardUID: dashboardUID });
  };

  onLanguageChanged = (language: string) => {
    this.setState({ language });

    reportInteraction('grafana_preferences_language_changed', {
      toLanguage: language,
      preferenceType: this.props.preferenceType,
    });
  };

  render() {
    const { theme, timezone, weekStart } = this.state;
    const { disabled } = this.props;
    const styles = getStyles();
    // const languages = getLanguageOptions();
    const currentThemeOption = this.themeOptions.find((x) => x.value === theme) ?? this.themeOptions[0];

    return (
      <form onSubmit={this.onSubmitForm} className={styles.form}>
        <FieldSet label={<Trans i18nKey="shared-preferences.title">Preferences</Trans>} disabled={disabled}>
          <Field label={t('shared-preferences.fields.theme-label', 'Interface theme')}>
            <Select
              options={this.themeOptions}
              value={currentThemeOption}
              onChange={this.onThemeChanged}
              inputId="shared-preferences-theme-select"
            />
          </Field>

          {/* <Field
            label={
              <Label htmlFor="home-dashboard-select">
                <span className={styles.labelText}>
                  <Trans i18nKey="shared-preferences.fields.home-dashboard-label">Home Dashboard</Trans>
                </span>
              </Label>
            }
            data-testid="User preferences home dashboard drop down"
          >
            <DashboardPicker
              value={homeDashboardUID}
              onChange={(v) => this.onHomeDashboardChanged(v?.uid ?? '')}
              defaultOptions={true}
              isClearable={true}
              placeholder={t('shared-preferences.fields.home-dashboard-placeholder', 'Default dashboard')}
              inputId="home-dashboard-select"
            />
          </Field> */}

          <Field
            label={t('shared-dashboard.fields.timezone-label', 'Timezone')}
            data-testid={selectors.components.TimeZonePicker.containerV2}
          >
            <TimeZonePicker
              includeInternal={true}
              value={timezone}
              onChange={this.onTimeZoneChanged}
              inputId="shared-preferences-timezone-picker"
            />
          </Field>

          <Field
            label={t('shared-preferences.fields.week-start-label', 'Week start')}
            data-testid={selectors.components.WeekStartPicker.containerV2}
          >
            <WeekStartPicker
              value={weekStart || ''}
              onChange={this.onWeekStartChanged}
              inputId={'shared-preferences-week-start-picker'}
            />
          </Field>

          {/* <Field
            label={
              <Label htmlFor="locale-select">
                <span className={styles.labelText}>
                  <Trans i18nKey="shared-preferences.fields.locale-label">Language</Trans>
                </span>
                <FeatureBadge featureState={FeatureState.beta} />
              </Label>
            }
            data-testid="User preferences language drop down"
          >
            <Select
              value={languages.find((lang) => lang.value === language)}
              onChange={(lang: SelectableValue<string>) => this.onLanguageChanged(lang.value ?? '')}
              options={languages}
              placeholder={t('shared-preferences.fields.locale-placeholder', 'Choose language')}
              inputId="locale-select"
            />
          </Field> */}
        </FieldSet>
        <Button type="submit" variant="primary" data-testid={selectors.components.UserProfile.preferencesSaveButton}>
          <Trans i18nKey="common.save">Save</Trans>
        </Button>
      </form>
    );
  }
}

export default SharedPreferences;

const getStyles = stylesFactory(() => {
  return {
    labelText: css({
      marginRight: '6px',
    }),
    form: css({
      width: '100%',
      maxWidth: '600px',
    }),
  };
});

function getTranslatedThemeName(theme: ThemeRegistryItem) {
  switch (theme.id) {
    case 'dark':
      return t('shared.preferences.theme.dark-label', 'Dark');
    case 'light':
      return t('shared.preferences.theme.light-label', 'Light');
    case 'system':
      return t('shared.preferences.theme.system-label', 'System preference');
    default:
      return theme.name;
  }
}
