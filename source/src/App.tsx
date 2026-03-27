import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TagProvider } from "@/context/TagContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import EventDetail from "@/pages/EventDetail";
import Auth from "@/pages/Auth";
import Onboarding from "@/pages/Onboarding";
import { JoinProvider } from "@/context/JoinContext";
import Henvisning from "@/pages/Henvisning";
import { useReferralCapture } from "@/hooks/useReferral";
// Firma pages
import FirmaDashboard from "@/pages/FirmaDashboard";
import FirmaEvents from "@/pages/FirmaEvents";
import FirmaTargeting from "@/pages/FirmaTargeting";
import FirmaAnalytics from "@/pages/FirmaAnalytics";
import FirmaFakturering from "@/pages/FirmaFakturering";
import FirmaRekruttering from "@/pages/FirmaRekruttering";
import Indstillinger from "@/pages/Indstillinger";
import Overblik from "@/pages/Overblik";
// Desktop layout (now the default)
import DesktopAppLayout from "@/components/DesktopAppLayout";
import TestFeed from "@/pages/TestFeed";
import TestUdforsk from "@/pages/TestUdforsk";
import TestKort from "@/pages/TestKort";
import TestBeskeder from "@/pages/TestBeskeder";
import TestMinSide from "@/pages/TestMinSide";

function MainRouter() {
  return (
    <DesktopAppLayout>
      <Switch>
        <Route path="/" component={TestFeed} />
        <Route path="/test" component={TestFeed} />
        <Route path="/udforsk" component={TestUdforsk} />
        <Route path="/kort" component={TestKort} />
        <Route path="/beskeder" component={TestBeskeder} />
        <Route path="/min-side" component={TestMinSide} />
        <Route path="/event/:id" component={EventDetail} />
        <Route component={NotFound} />
      </Switch>
    </DesktopAppLayout>
  );
}

function FirmaRouter() {
  return (
    <Switch>
      <Route path="/firma/events" component={FirmaEvents} />
      <Route path="/firma/targeting" component={FirmaTargeting} />
      <Route path="/firma/analytics" component={FirmaAnalytics} />
      <Route path="/firma/fakturering" component={FirmaFakturering} />
      <Route path="/firma/rekruttering" component={FirmaRekruttering} />
      <Route path="/firma/indstillinger" component={Indstillinger} />
      <Route path="/firma" component={FirmaDashboard} />
    </Switch>
  );
}

function RootRouter() {
  const [location] = useHashLocation();
  const isFirma = location.startsWith("/firma");
  const isHenvisning = location === "/henvisning";
  const isAuth = location === "/auth";
  const isOnboarding = location === "/onboarding";

  if (isFirma) return <FirmaRouter />;
  if (isHenvisning) return <Henvisning />;
  if (isAuth) return <Auth />;
  if (isOnboarding) return <Onboarding />;
  return <MainRouter />;
}

function App() {
  useReferralCapture();
  return (
    <QueryClientProvider client={queryClient}>
      <TagProvider>
        <AuthProvider>
          <JoinProvider>
            <Router hook={useHashLocation}>
              <RootRouter />
            </Router>
            <Toaster />
          </JoinProvider>
        </AuthProvider>
      </TagProvider>
    </QueryClientProvider>
  );
}

export default App;
