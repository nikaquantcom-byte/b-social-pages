import { Switch, Route, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TagProvider } from "@/context/TagContext";
import { AuthProvider } from "@/context/AuthContext";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Feed from "@/pages/Feed";
import Udforsk from "@/pages/Udforsk";
import Beskeder from "@/pages/Beskeder";
import MinSide from "@/pages/MinSide";
import EventDetail from "@/pages/EventDetail";
import SocialDetail from "@/pages/SocialDetail";
import Inspiration from "@/pages/Inspiration";
import Auth from "@/pages/Auth";
import Kalender from "@/pages/Kalender";
import Overblik from "@/pages/Overblik";
import Noter from "@/pages/Noter";
import Historik from "@/pages/Historik";
import Indstillinger from "@/pages/Indstillinger";
import Kort from "@/pages/Kort";
import Onboarding from "@/pages/Onboarding";
import CategoryDetail from "@/pages/CategoryDetail";
import StedDetail from "@/pages/StedDetail";
import { JoinProvider } from "@/context/JoinContext";

// Firma pages
import FirmaDashboard from "@/pages/FirmaDashboard";
import FirmaEvents from "@/pages/FirmaEvents";
import FirmaTargeting from "@/pages/FirmaTargeting";
import FirmaAnalytics from "@/pages/FirmaAnalytics";
import FirmaFakturering from "@/pages/FirmaFakturering";

function AppRouter() {
  return (
    <div className="phone-wrapper dark">
      <div className="phone-container">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/feed" component={Feed} />
          <Route path="/udforsk" component={Udforsk} />
          <Route path="/kategori/:category" component={CategoryDetail} />
          <Route path="/kort" component={Kort} />
          <Route path="/beskeder" component={Beskeder} />
          <Route path="/min-side" component={MinSide} />
          <Route path="/event/:id" component={EventDetail} />
          <Route path="/social/:id" component={SocialDetail} />
          <Route path="/sted/:id" component={StedDetail} />
          <Route path="/inspiration" component={Inspiration} />
          <Route path="/auth" component={Auth} />
          <Route path="/kalender" component={Kalender} />
          <Route path="/overblik" component={Overblik} />
          <Route path="/noter" component={Noter} />
          <Route path="/historik" component={Historik} />
          <Route path="/indstillinger" component={Indstillinger} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function FirmaRouter() {
  return (
    <Switch>
      <Route path="/firma" component={FirmaDashboard} />
      <Route path="/firma/events" component={FirmaEvents} />
      <Route path="/firma/targeting" component={FirmaTargeting} />
      <Route path="/firma/analytics" component={FirmaAnalytics} />
      <Route path="/firma/fakturering" component={FirmaFakturering} />
    </Switch>
  );
}

function RootRouter() {
  const [location] = useHashLocation();
  const isFirma = location.startsWith("/firma");

  if (isFirma) {
    return <FirmaRouter />;
  }
  return <AppRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TagProvider>
          <JoinProvider>
            <TooltipProvider>
              <Toaster />
              <Router hook={useHashLocation}>
                <RootRouter />
              </Router>
            </TooltipProvider>
          </JoinProvider>
        </TagProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
