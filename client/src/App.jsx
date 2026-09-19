import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import NfcPage from "./pages/NfcPage";
import Login from "./pages/Login";
import AccessPage from "./pages/AccessPage";
import EmergencyPage from "./pages/EmergencyPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TagDetails from "./pages/TagDetails";
import ResourcesPage from "./pages/ResourcesPage";
import PoliciesPage from "./pages/PoliciesPage";

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

                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tags/:tagId" element={<TagDetails />} />
                <Route  path="/resources/:tagId"element={<ResourcesPage />}/>
                <Route path="/policies/:tagId"element={<PoliciesPage />}/>

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