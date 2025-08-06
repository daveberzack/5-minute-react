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
    <section id="friends" className="max-w-4xl mx-auto p-4">
      
      {/* Friends List */}
      <ul id="friends-list" className="list-none p-0 space-y-2 mb-8">
        { user?.friends?.map( f => {
          console.log("?"+f.id,f)
          return (
            <li key={f.id} className="bg-white text-black rounded-lg shadow-sm py-2 px-4 hover:shadow-lg transition-all duration-300 flex justify-between items-center">
              <div style={{ backgroundColor: f.color }} className="w-12 h-12 rounded-xl border-2 border-black mr-1 text-4xl justify-center items-center font-bold flex">{f.character}</div>
              <span className="font-medium">{f.username}</span>
              <button
                data-id={f.id}
                onClick={onClickRemove}
                className="w-9 h-9 rounded-full bg-yellow-400 fill-black flex items-center justify-center transition-colors duration-200 border-[3px] border-black"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 pointer-events-none stroke-black stroke-1"
                >
                  <path d="M19,13H5V11H19V13Z" strokeWidth="0.5" />
                </svg>
              </button>
            </li>
          );
        }) }
      </ul>

      {/* Add Friend Form */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center space-x-2">
          <input
            id="new-friend-name"
            placeholder="Enter username to add"
            value={newFriendName}
            onChange={(e)=>{ setNewFriendName(e.target.value); setErrorMessage("") }}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            onClick={onClickAdd}
            className="w-9 h-9 rounded-full bg-yellow-400 fill-black flex items-center justify-center transition-colors duration-200 border-[3px] border-black"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 pointer-events-none stroke-black stroke-1"
            >
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" strokeWidth="0.5" />
            </svg>
          </button>
        </div>
        <p>{errorMessage}</p>
      </div>
    </section>
  );
}

export default Friends;