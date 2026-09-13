import { type ReactNode } from 'react';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { About, BlogDetail, BlogIndex, Contact, Home, LocationDetail, LocationsHub, MissingState, ProjectDetail, ProjectsIndex, ServiceDetail, ServicesHub } from '@/pages';

function Router() {
  return <RoutedErrorBoundary><Switch>
    <Route path="/" component={Home} />
    <Route path="/marangoz/" component={ServicesHub} />
    <Route path="/blog/" component={BlogIndex} />
    <Route path="/hizmetler/:slug/" component={ServiceDetail} />
    <Route path="/hizmet-bolgeleri/" component={LocationsHub} />
    <Route path="/hizmet-bolgeleri/:slug/" component={LocationDetail} />
    <Route path="/projeler/" component={ProjectsIndex} />
    <Route path="/projeler/:slug/" component={ProjectDetail} />
    <Route path="/blog/:slug/" component={BlogDetail} />
    <Route path="/hakkimizda/" component={About} />
    <Route path="/iletisim/" component={Contact} />
    <Route component={() => <MissingState label="Sayfa bulunamadı" />} />
  </Switch></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <div data-route={location}>{children}</div>;
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}

export default App;
