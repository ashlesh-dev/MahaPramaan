import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/login/LoginPage';
import OverviewPage from './pages/entrepreneur/OverviewPage';
import BusinessProfilePage from './pages/entrepreneur/BusinessProfilePage';
import ApprovalRoadmapPage from './pages/entrepreneur/ApprovalRoadmapPage';
import ApplicationsPage from './pages/entrepreneur/ApplicationsPage';
import ApplicationDetailPage from './pages/entrepreneur/ApplicationDetailPage';
import DocumentCenterPage from './pages/entrepreneur/DocumentCenterPage';
import PreValidationPage from './pages/entrepreneur/PreValidationPage';
import InspectionPlannerPage from './pages/entrepreneur/InspectionPlannerPage';
import CompliancePage from './pages/entrepreneur/CompliancePage';
import SchemesPage from './pages/entrepreneur/SchemesPage';
import AlertsPage from './pages/entrepreneur/AlertsPage';
import GrievancePage from './pages/entrepreneur/GrievancePage';
import OfficerOverviewPage from './pages/government/OfficerOverviewPage';
import BottleneckAnalyticsPage from './pages/government/BottleneckAnalyticsPage';
import RiskScrutinyPage from './pages/government/RiskScrutinyPage';
import GovInspectionPlannerPage from './pages/government/GovInspectionPlannerPage';
import DataReusePage from './pages/government/DataReusePage';
import GovApplicationsPage from './pages/government/GovApplicationsPage';
import RegistrationPage from './pages/entrepreneur/RegistrationPage';
import PublicHomePage from './pages/PublicHomePage';
import { useApp } from './hooks/useApp';

export default function App() {
  const { role } = useApp();

  return (
    <Routes>
      <Route path="/" element={role ? <Navigate to={role === 'officer' ? '/gov/overview' : '/overview'} replace /> : <PublicHomePage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<Layout />}>
        
        {/* Entrepreneur Routes */}
        <Route path="overview" element={<OverviewPage />} />
        <Route path="register" element={<RegistrationPage />} />
        <Route path="business" element={<BusinessProfilePage />} />
        <Route path="roadmap" element={<ApprovalRoadmapPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="applications/:id" element={<ApplicationDetailPage />} />
        <Route path="documents" element={<DocumentCenterPage />} />
        <Route path="prevalidation" element={<PreValidationPage />} />
        <Route path="inspections" element={<InspectionPlannerPage />} />
        <Route path="compliance" element={<CompliancePage />} />
        <Route path="schemes" element={<SchemesPage />} />
        <Route path="alerts" element={<AlertsPage />} />
        <Route path="grievances" element={<GrievancePage />} />

        {/* Government Routes */}
        <Route path="gov/overview" element={<OfficerOverviewPage />} />
        <Route path="gov/applications" element={<GovApplicationsPage />} />
        <Route path="gov/bottlenecks" element={<BottleneckAnalyticsPage />} />
        <Route path="gov/scrutiny" element={<RiskScrutinyPage />} />
        <Route path="gov/inspections" element={<GovInspectionPlannerPage />} />
        <Route path="gov/prefill" element={<DataReusePage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
