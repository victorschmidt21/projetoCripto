import { RouterProvider } from "react-router-dom";
import { routerApp } from "./router";
function App() {
  return (
    <>
      <RouterProvider router={routerApp} />
    </>
  );
}

export default App;
