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
    <section id="friends" className="max-w-4xl mx-auto p-1 sm:p-2">
      
      {/* Friends List */}
      <ul id="friends-list" className="list-none p-0 space-y-1 sm:space-y-2 mb-6 sm:mb-8">
        { user?.friends?.map( f => {
          console.log("?"+f.id,f)
          return (
            <li key={f.id} className="bg-white text-black rounded-lg shadow-sm py-2 px-3 sm:px-4 hover:shadow-lg transition-all duration-300 flex justify-between items-center">
              <div className="flex items-center flex-1 min-w-0">
                <div style={{ backgroundColor: f.color }} className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-black mr-2 sm:mr-3 text-2xl sm:text-4xl justify-center items-center font-bold flex flex-shrink-0">{f.character}</div>
                <span className="font-medium text-sm sm:text-base truncate">{f.username}</span>
              </div>
              <button
                data-id={f.id}
                onClick={onClickRemove}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-400 fill-black flex items-center justify-center transition-colors duration-200 border-2 sm:border-[3px] border-black flex-shrink-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none stroke-black stroke-1"
                >
                  <path d="M19,13H5V11H19V13Z" strokeWidth="0.5" />
                </svg>
              </button>
            </li>
          );
        }) }
      </ul>

      {/* Add Friend Form */}
      <div className="bg-white rounded-lg shadow-md p-3 sm:p-4">
        <div className="flex items-center space-x-2">
          <input
            id="new-friend-name"
            placeholder="Enter username to add"
            value={newFriendName}
            onChange={(e)=>{ setNewFriendName(e.target.value); setErrorMessage("") }}
            className="flex-grow px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <button
            onClick={onClickAdd}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-yellow-400 fill-black flex items-center justify-center transition-colors duration-200 border-2 sm:border-[3px] border-black flex-shrink-0"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none stroke-black stroke-1"
            >
              <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" strokeWidth="0.5" />
            </svg>
          </button>
        </div>
        {errorMessage && <p className="text-red-600 text-sm mt-2">{errorMessage}</p>}
      </div>
    </section>
  );
}

export default Friends;