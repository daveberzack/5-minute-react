import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Friends() {

  const { user, addFriend, removeFriend } = useAuth();

  const [newFriendName, setNewFriendName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onClickRemove = (e)=> {
    const id = e.target.dataset.id;
    removeFriend(id);
  }

  const onClickAdd = async (e)=> {
    const added = await addFriend(newFriendName);
    if (added){
      setNewFriendName("");
    }
    else {
      setErrorMessage("User not found");
    }
  }

  return (
    <section id="friends" className="max-w-4xl mx-auto p-2 sm:p-3 relative z-10">
      <h2 className="text-2xl font-bold text-black text-left mb-3">Friends</h2>
      
      {/* Friends List */}
      <ul id="friends-list" className="list-none p-0 space-y-1.5 mb-4">
        { user?.friends?.map( f => {
          console.log("?"+f.id,f)
          return (
            <li key={f.id} className="game-card text-gray-800 py-2 px-2.5 flex justify-between items-center group">
              <div className="flex items-center flex-1 min-w-0">
                <div style={{ backgroundColor: f.color }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 mr-3 text-lg sm:text-xl justify-center items-center font-bold flex flex-shrink-0 shadow-sm">{f.character}</div>
                <span className="font-medium text-base sm:text-lg truncate">{f.username}</span>
              </div>
              <button
                data-id={f.id}
                onClick={onClickRemove}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-200 shadow-sm flex-shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none fill-current"
                >
                  <path d="M19,13H5V11H19V13Z" />
                </svg>
              </button>
            </li>
          );
        }) }
      </ul>

      {/* Add Friend Form */}
      <div className="game-card p-3">
        <div className="flex items-center space-x-2">
          <input
            id="new-friend-name"
            placeholder="Enter username to add"
            value={newFriendName}
            onChange={(e)=>{ setNewFriendName(e.target.value); setErrorMessage("") }}
            className="form-input flex-grow px-3 py-2.5 text-sm rounded-lg shadow-sm focus:outline-none transition-all duration-300"
          />
          <button
            onClick={onClickAdd}
            className="btn-gradient w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-md flex-shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 pointer-events-none fill-current text-white"
            >
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
          </button>
        </div>
        {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      </div>
    </section>
  );
}

export default Friends;