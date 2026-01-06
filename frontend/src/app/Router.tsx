import { useUIStore } from '../store/uiStore';
import { OverviewPage } from '../features/overview/OverviewPage';
import { AnalyticsPage } from '../features/analytics/AnalyticsPage';
import { ValidatorsPage } from '../features/validator/ValidatorsPage';
import { EventsPage } from '../features/events/EventsPage';
import { SettingsPage } from '../features/settings/SettingsPage';

export const Router = () => {
    const { currentView } = useUIStore();

    switch (currentView) {
        case 'overview':
            return <OverviewPage />;
        case 'analytics':
            return <AnalyticsPage />;
        case 'validators':
            return <ValidatorsPage />;
        case 'events':
            return <EventsPage />;
        case 'settings':
            return <SettingsPage />;
        default:
            return <OverviewPage />;
    }
};
