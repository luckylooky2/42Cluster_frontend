import { UrlModule } from 'app/features/dashboard/utils/42cluster/urlModule';

describe('Panel', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/d/unique-dashboard-id/',
        search: '',
      },
    });
  });

  it('Add params first', () => {
    window.location.search = '';

    const url = new UrlModule();
    expect(url.addParam('viewPanel', '1').getUrl()).toBe(window.location.pathname + '?viewPanel=1');
  });

  it('Add params second', () => {
    window.location.search = '?orgId=1';

    const url = new UrlModule();
    expect(url.addParam('viewPanel', '1').getUrl()).toBe(
      window.location.pathname + window.location.search + '&viewPanel=1'
    );
  });

  it('Delete params first', () => {
    window.location.search = '?viewPanel=1';

    const url = new UrlModule();
    expect(url.deleteParam('viewPanel').getUrl()).toBe(window.location.pathname);
  });

  it('Delete params second', () => {
    window.location.search = '?orgId=1&viewPanel=1&from=now-1h&to=now';

    const url = new UrlModule();
    expect(url.deleteParam('viewPanel').getUrl()).toBe(window.location.pathname + '?orgId=1&from=now-1h&to=now');
  });

  it('Delete params last', () => {
    window.location.search = '?orgId=1&viewPanel';

    const url = new UrlModule();
    expect(url.deleteParam('viewPanel').getUrl()).toBe(window.location.pathname + '?orgId=1');
  });
});

describe('Reset button', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/d/unique-dashboard-id/',
        search: '',
      },
    });
  });

  it('Restore Time Range w/ variable', () => {
    window.location.search = '?var-namespace=kube-system&var-namespace=monitoring&from=now-2h&to=now';

    const url = new UrlModule();
    expect(url.updateParam('from', 'now-1h').updateParam('to', 'now').getUrl()).toBe(
      window.location.pathname + '?var-namespace=kube-system&var-namespace=monitoring&from=now-1h&to=now'
    );
  });

  it('Restore Time Range w/o variable', () => {
    window.location.search = '?orgId=1&from=now-2h&to=now&kiosk';

    const url = new UrlModule();
    expect(url.updateParam('from', 'now-1h').updateParam('to', 'now').getUrl()).toBe(
      window.location.pathname + '?orgId=1&from=now-1h&to=now&kiosk'
    );
  });

  it('Delete All Filter', () => {
    window.location.search =
      '?orgId=1&var-Filters=namespace%23%70%23mogle&var-Filters=namespace%23%70%23monitoring&var-Filters=node%23%70%23node-1&from=now-2h&to=now&kiosk';

    const url = new UrlModule();
    expect(url.deleteAllParam('var-Filters').getUrl()).toBe(
      window.location.pathname + '?orgId=1&from=now-2h&to=now&kiosk'
    );
  });
});

describe('getParams', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        pathname: '/d/unique-dashboard-id/',
        search: '',
      },
    });
  });

  it('empty search', () => {
    const url = new UrlModule();
    expect(url.getParams().length).toBe(0);
  });

  it('long', () => {
    window.location.search =
      '?orgId=1&var-Filters=namespace%23%70%23mogle&var-Filters=namespace%23%70%23monitoring&var-Filters=node%23%70%23node-1&from=now-2h&to=now&kiosk';
    const url = new UrlModule();
    expect(url.getParams().length).toBe(7);
  });
});
