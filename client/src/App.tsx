import { Route, Routes } from "react-router-dom";

import Chat from "./pages/Chat";
import Wrapper from "./components/Wrapper";

export default function App() {
    return (
        <Wrapper>
            <Routes>
                <Route path="/" element={<Chat />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:id" element={<Chat />} />
                <Route path="*" element={<Chat />} />
            </Routes>
        </Wrapper>
    );
}
