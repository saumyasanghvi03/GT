import { useMode } from '../context/ModeContext';
import DashboardAMC from './dashboards/DashboardAMC';
import DashboardWealth from './dashboards/DashboardWealth';
import DashboardAdvisor from './dashboards/DashboardAdvisor';
import DashboardInstitutional from './dashboards/DashboardInstitutional';

const Overview = () => {
  const { mode } = useMode();

  switch (mode) {
    case 'Wealth':
      return <DashboardWealth />;
    case 'Advisor':
      return <DashboardAdvisor />;
    case 'Institutional':
      return <DashboardInstitutional />;
    case 'AMC':
    default:
      return <DashboardAMC />;
  }
};

export default Overview;
