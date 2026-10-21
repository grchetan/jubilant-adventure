import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";


declare const __BASE_PATH__: string | undefined;

function App() {
  const basename = typeof __BASE_PATH__ !== "undefined" ? __BASE_PATH__ : "/";
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={basename}>
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;
