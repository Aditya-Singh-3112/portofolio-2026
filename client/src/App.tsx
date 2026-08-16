import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Home section="home" />} />
      <Route path="/about" component={() => <Home section="about" />} />
      <Route path="/experience" component={() => <Home section="experience" />} />
      <Route path="/research" component={() => <Home section="research" />} />
      <Route path="/projects" component={() => <Home section="projects" />} />
      <Route path="/skills" component={() => <Home section="skills" />} />
      <Route path="/interests" component={() => <Home section="interests" />} />
      <Route path="/contact" component={() => <Home section="contact" />} />
      <Route component={() => <Home section="home" />} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster theme="dark" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
