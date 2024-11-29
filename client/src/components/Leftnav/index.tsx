import Button from "../Button";
import ChatHistory from "../Chat/History";
import { useUser } from "../../context/UserContext";
import { useHistory } from "../../context/HistoryContext";

import "./leftnav.scss";
import { BsPlusCircle } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function LeftNav() {
    const { user } = useUser();

    return (
        <nav className="left-nav">
            <Link to="/" className="home">
                <BsPlusCircle />
            </Link>

            {user ? (
                <div className="chats">
                    <ChatHistory />
                </div>
            ) : (
                <div className="warning">
                    <p>
                        Please login to start using <span>Assisternity</span>
                    </p>
                </div>
            )}
        </nav>
    );
}
