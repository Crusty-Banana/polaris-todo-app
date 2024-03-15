import "./App.css";
import MainFrame from "../MainFrame/MainFrame";
import { AppProvider } from "@shopify/polaris";
import en from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

function App() {
  return (
    <AppProvider i18n={en}>
      <MainFrame />
    </AppProvider>
  );
}

export default App;
