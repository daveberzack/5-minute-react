import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateGamePlay, getGamePlayForToday } from '../services/gameService';
import { clearRecentGameVisit } from '../services/gameActivityService';
import { games } from '../data/games';

function EditScoreForm() {
    const { gameId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [score, setScore] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [gameName, setGameName] = useState("");

    const { user } = useAuth();

    useEffect(() => {
        if (!user || !gameId) return;

        // Find game name
        const game = games.find(g => g.id.toString() === gameId);
        setGameName(game ? game.name : `Game ${gameId}`);

        // Load existing score if available
        const loadExistingScore = async () => {
            try {
                const existingPlay = await getGamePlayForToday(gameId);
                if (existingPlay) {
                    setScore(existingPlay.score || "");
                    setMessage(existingPlay.message || "");
                }
            } catch (error) {
                console.error('Error loading existing score:', error);
            }
        };

        loadExistingScore();
    }, [user, gameId]);

    const submit = async () => {
        if (!score.trim()) {
            setError("Please enter a score");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await updateGamePlay({
                game_id: gameId,
                score: score.trim(),
                message: message.trim()
            });

            // Clear recent game visit data since score has been entered
            clearRecentGameVisit();

            // Navigate back to where user came from, or default to favorites
            const from = location.state?.from || '/favorites';
            navigate(from);
        } catch (error) {
            console.error('Error updating score:', error);
            setError("Failed to save score. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const cancel = () => {
        // Clear recent game visit data when user cancels
        clearRecentGameVisit();
        
        // Navigate back to where user came from, or default to favorites
        const from = location.state?.from || '/favorites';
        navigate(from);
    };

    if (!gameId) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <div className="text-red-600">Game not found</div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
                {score ? 'Update Score' : 'Add Score'}
            </h3>
            
            {gameName && (
                <p className="text-gray-600 mb-4">Game: {gameName}</p>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label htmlFor="score-field" className="block text-sm font-medium text-gray-700 mb-1">
                        Score *
                    </label>
                    <input
                        id="score-field"
                        type="text"
                        placeholder="e.g., 3/6, 2:45, 1250"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Enter your score in any format (numbers, fractions, time, etc.)
                    </p>
                </div>

                <div>
                    <label htmlFor="message-field" className="block text-sm font-medium text-gray-700 mb-1">
                        Message (optional)
                    </label>
                    <input
                        id="message-field"
                        type="text"
                        placeholder="Add a note about your game..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loading}
                    />
                </div>

                <div className="flex space-x-3 pt-2">
                    <button
                        onClick={submit}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : 'Save Score'}
                    </button>
                    <button
                        onClick={cancel}
                        disabled={loading}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditScoreForm;



