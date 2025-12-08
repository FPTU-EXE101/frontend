import "./App.css";
import AppRoutes from "./router/app-routers";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {" "}
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
