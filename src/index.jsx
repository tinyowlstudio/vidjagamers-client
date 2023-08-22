import { createRoot } from 'react-dom/client';

import { MainView } from "./components/main-view/main-view";

// Import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

// Main component (will eventually use all the others)
const VidjaGamersxApplication = () => {
  return <MainView />;//short for <MainView></MainView> in jsx since there are no nested elements
};

// Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

// Tells React to render your app in the root DOM element
root.render(<VidjaGamersxApplication />);