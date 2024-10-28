import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MainRoutesPublic} from '../src/routes/AppRouter'
import '../src/index.css'


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <MainRoutesPublic/>
    </BrowserRouter>
  </React.StrictMode>
);
