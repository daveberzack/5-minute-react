import { useEffect, useState } from 'react';
import { useData } from '../utils/DataContext';

function EditScoreForm() {

    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("");

    const { userData, gameIdPlayEditing, updatePlay, cancelEditPlay } = useData();

    useEffect( ()=> {
        if (!userData || !gameIdPlayEditing) return;
        const currentScore = userData.todayPlays[gameIdPlayEditing]?.score || 0;
        const currentMessage = userData.todayPlays[gameIdPlayEditing]?.message || "";
        setScore( currentScore )
        setMessage( currentMessage )
    },[userData, gameIdPlayEditing]);

    const submit = () => {
        updatePlay(score, message);
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



