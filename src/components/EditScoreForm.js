import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function EditScoreForm() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [score, setScore] = useState("0");
    const [message, setMessage] = useState("");

    const { user, updatePlay } = useAuth();

    useEffect( ()=> {
        if (!user || !gameId) return;
        const currentScore = user.todayPlays[gameId]?.score || "0";
        const currentMessage = user.todayPlays[gameId]?.message || "";
        setScore( currentScore )
        setMessage( currentMessage )
    },[user, gameId]);

    const submit = async () => {
        await updatePlay(gameId, score, message);
        navigate('/favorites');
    }

    const cancel = () => {
        navigate('/favorites');
    }

    if (!gameId) {
        return <div>Game not found</div>;
    }

    return (
        <section id="edit-score" className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Add/Update Score</h3>
            <div className="space-y-4">
                <input
                    id="score-field"
                    placeholder="Score"
                    value={score || ''}
                    onChange={(e)=>{ setScore(e.target.value ? parseInt(e.target.value) : 0) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    id="message-field"
                    placeholder="Message (optional)"
                    value={message}
                    onChange={(e)=>{ setMessage(e.target.value) }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex space-x-3">
                    <button
                        onClick={submit}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Submit
                    </button>
                    <button
                        onClick={cancel}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </section>
    );
}

export default EditScoreForm;



