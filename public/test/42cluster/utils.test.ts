import { isTimeRangeChanged, isTemplateVariableFiltered } from 'app/features/dashboard/utils/42cluster/utils';

describe('Time Range Changed', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/d/unique-dashboard-id/',
        search: '',
      },
    });
  });

  it('default', () => {
    window.location.search = '?orgId=1&viewPanel=1&from=now-1h&to=now';
    expect(isTimeRangeChanged()).toBe(false);
  });

  it('no time variable', () => {
    window.location.search = '?orgId=1&viewPanel=1';

    expect(isTimeRangeChanged()).toBe(false);
  });

  it('no variable', () => {
    expect(isTimeRangeChanged()).toBe(false);
  });

  it('from variable only', () => {
    window.location.search = '?from=now-1h';
    expect(isTimeRangeChanged()).toBe(false);
  });

  it('to variable only', () => {
    window.location.search = '?to=now';
    expect(isTimeRangeChanged()).toBe(false);
  });

  it('from variable only and changed', () => {
    window.location.search = '?from=now-2h';
    expect(isTimeRangeChanged()).toBe(true);
  });

  it('to variable only and changed', () => {
    window.location.search = '?to=now-1h';
    expect(isTimeRangeChanged()).toBe(true);
  });

  it('changed from variable', () => {
    window.location.search = '?orgId=1&viewPanel=1&from=now-2h&to=now';
    expect(isTimeRangeChanged()).toBe(true);
  });
});

describe('Template Variable Filtered', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/d/unique-dashboard-id/',
        search: '',
      },
    });
  });

  it('not filtered', () => {
    window.location.search = '?orgId=1&viewPanel=1&from=now-1h&to=now';

    expect(isTemplateVariableFiltered()).toBe(false);
  });

  it('filtered', () => {
    window.location.search =
      '?orgId=1&var-Filters=namespace%23%70%23mogle&var-Filters=namespace%23%70%23monitoring&var-Filters=node%23%70%23node-1&from=now-2h&to=now&kiosk';

    expect(isTemplateVariableFiltered()).toBe(true);
  });
});
