import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function EditScoreForm() {

    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("");

    const { user, gameIdPlayEditing, updatePlay, cancelEditPlay } = useAuth();

    useEffect( ()=> {
        if (!user || !gameIdPlayEditing) return;
        const currentScore = user.todayPlays[gameIdPlayEditing]?.score || 0;
        const currentMessage = user.todayPlays[gameIdPlayEditing]?.message || "";
        setScore( currentScore )
        setMessage( currentMessage )
    },[user, gameIdPlayEditing]);

    const submit = () => {
        updatePlay(gameIdPlayEditing, score, message);
    }

    if (gameIdPlayEditing) return (
        <section id="login">
            <h3>Add/Update Score</h3>
            <input 
                id="score-field" 
                placeholder="score" 
                value={score} 
                onChange={(e)=>{ setScore(parseInt(e.target.value)) }}
            />
            <input  
                id="message-field" 
                placeholder="message" 
                value={message} 
                onChange={(e)=>{ setMessage(e.target.value) }}
            />
            <button onClick={submit}>Submit</button>
            <button onClick={cancelEditPlay}>Cancel</button>

        </section>
    );
}

export default EditScoreForm;



