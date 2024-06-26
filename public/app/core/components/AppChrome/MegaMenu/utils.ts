import { locationUtil, NavModelItem } from '@grafana/data';
import { config, reportInteraction } from '@grafana/runtime';
import { t } from 'app/core/internationalization';

import { ShowModalReactEvent } from '../../../../types/events';
import appEvents from '../../../app_events';
import { getFooterLinks } from '../../Footer/Footer';
import { HelpModal } from '../../help/HelpModal';

export const enrichHelpItem = (helpItem: NavModelItem) => {
  let menuItems = helpItem.children || [];

  if (helpItem.id === 'help') {
    const onOpenShortcuts = () => {
      appEvents.publish(new ShowModalReactEvent({ component: HelpModal }));
    };
    helpItem.children = [
      ...menuItems,
      ...getFooterLinks(),
      ...getEditionAndUpdateLinks(),
      {
        id: 'keyboard-shortcuts',
        text: t('nav.help/keyboard-shortcuts', 'Keyboard shortcuts'),
        icon: 'keyboard',
        onClick: onOpenShortcuts,
      },
    ];
  }
  return helpItem;
};

export const enrichWithInteractionTracking = (item: NavModelItem, megaMenuDockedState: boolean) => {
  // creating a new object here to not mutate the original item object
  const newItem = { ...item };
  const onClick = newItem.onClick;
  newItem.onClick = () => {
    reportInteraction('grafana_navigation_item_clicked', {
      path: newItem.url ?? newItem.id,
      menuIsDocked: megaMenuDockedState,
    });
    onClick?.();
  };
  if (newItem.children) {
    newItem.children = newItem.children.map((item) => enrichWithInteractionTracking(item, megaMenuDockedState));
  }
  return newItem;
};

export const isMatchOrChildMatch = (itemToCheck: NavModelItem, searchItem?: NavModelItem) => {
  return Boolean(itemToCheck === searchItem || hasChildMatch(itemToCheck, searchItem));
};

export const hasChildMatch = (itemToCheck: NavModelItem, searchItem?: NavModelItem): boolean => {
  return Boolean(
    itemToCheck.children?.some((child) => {
      if (child === searchItem) {
        return true;
      } else {
        return hasChildMatch(child, searchItem);
      }
    })
  );
};

const stripQueryParams = (url?: string) => {
  return url?.split('?')[0] ?? '';
};

// currentMatchUrl이 /d/efa86fd1d0c121a26444b636a3f509a8이 되면서 대부분 false가 되기 때문에 삭제
// const isBetterMatch = (newMatch: NavModelItem, currentMatch?: NavModelItem) => {
//   const currentMatchUrl = stripQueryParams(currentMatch?.url);
//   const newMatchUrl = stripQueryParams(newMatch.url);
//   return newMatchUrl && newMatchUrl.length > currentMatchUrl?.length;
// };

export const getActiveItem = (
  navTree: NavModelItem[],
  pathname: string,
  currentBestMatch?: NavModelItem
): NavModelItem | undefined => {
  // const dashboardLinkMatch = '/dashboards';

  for (const link of navTree) {
    const linkWithoutParams = stripQueryParams(link.url);
    const linkPathname = locationUtil.stripBaseFromUrl(linkWithoutParams);

    if (linkPathname && link.id !== 'starred') {
      if (linkPathname === pathname) {
        // exact match
        currentBestMatch = link;
        break;
      } else if (linkPathname !== '/' && pathname.startsWith(linkPathname)) {
        // partial match
        // if (isBetterMatch(link, currentBestMatch)) {
        currentBestMatch = link;
        // }
      } else if (linkPathname === '/alerting/list' && pathname.startsWith('/alerting/notification/')) {
        // alert channel match
        // TODO refactor routes such that we don't need this custom logic
        currentBestMatch = link;
        break;
      } else if (pathname.startsWith('/d/m') || pathname.startsWith('/metric')) {
        if (link.id === 'metric') {
          currentBestMatch = link;
        }
      } else if (pathname.startsWith('/d/a') || pathname.startsWith('/audit')) {
        if (link.id === 'audit') {
          currentBestMatch = link;
        }
      } else if (pathname.startsWith('/d/d') || pathname.startsWith('/deployment')) {
        if (link.id === 'deployment') {
          currentBestMatch = link;
        }
      } else if (linkPathname.startsWith('/d/') || pathname.startsWith('/d/') || pathname.startsWith('/dashboards')) {
        // dashboard match
        // TODO refactor routes such that we don't need this custom logic
        if (link.id === 'dashboards/browse') {
          currentBestMatch = link;
        }
      } else if (pathname.startsWith('/org') || pathname.startsWith('/plugins')) {
        currentBestMatch = link;
      }
    }
    // if (link.children) {
    //   currentBestMatch = getActiveItem(link.children, pathname, currentBestMatch);
    // }
    // if (stripQueryParams(currentBestMatch?.url) === pathname) {
    //   return currentBestMatch;
    // }
    // console.log(linkPathname, pathname, link, currentBestMatch);
  }
  return currentBestMatch;
};

export function getEditionAndUpdateLinks(): NavModelItem[] {
  const { buildInfo, licenseInfo } = config;
  const stateInfo = licenseInfo.stateInfo ? ` (${licenseInfo.stateInfo})` : '';
  const links: NavModelItem[] = [];

  links.push({
    target: '_blank',
    id: 'version',
    text: `${buildInfo.edition}${stateInfo}`,
    url: licenseInfo.licenseUrl,
    icon: 'external-link-alt',
  });

  if (buildInfo.hasUpdate) {
    links.push({
      target: '_blank',
      id: 'updateVersion',
      text: `New version available!`,
      icon: 'download-alt',
      url: 'https://grafana.com/grafana/download?utm_source=grafana_footer',
    });
  }

  return links;
}
