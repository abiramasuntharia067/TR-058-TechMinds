import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WasteFlow from "./pages/WasteFlow";
import History from "./pages/History";
import { useLocation } from "wouter";

const queryClient = new QueryClient();

function HistoryPage() {
  const [, setLocation] = useLocation();
  return <History onBack={() => setLocation("/")} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={WasteFlow} />
      <Route path="/history" component={HistoryPage} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}
