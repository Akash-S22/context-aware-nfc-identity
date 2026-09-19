import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import NfcPage from "./pages/NfcPage";
import Login from "./pages/Login";
import AccessPage from "./pages/AccessPage";
import EmergencyPage from "./pages/EmergencyPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/nfc/:tagId"
                    element={<NfcPage />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/access/:tagId"
                    element={<AccessPage />}
                />

                <Route
                    path="/emergency/:tagId"
                    element={<EmergencyPage />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;