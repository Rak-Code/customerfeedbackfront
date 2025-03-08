import { useState, useEffect } from "react";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [userFeedback, setUserFeedback] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const fetchFeedback = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    const userId = email.length; // Mock user ID from email length
    const response = await fetch(`http://localhost:8080/api/feedback/user/${userId}`);
    const data = await response.json();
    setUserFeedback(data);
  };

  const submitFeedback = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) return;
    const userId = email.length; // Mock user ID

    await fetch("http://localhost:8080/api/feedback/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content: feedback }),
    });

    setFeedback("");
    fetchFeedback();
  };

  const editFeedback = (id, content) => {
    setEditingId(id);
    setEditContent(content);
  };

  const updateFeedback = async (id) => {
    await fetch(`http://localhost:8080/api/feedback/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editContent }),
    });

    setEditingId(null);
    fetchFeedback();
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold">Feedback</h1>
      <h4 className="text-xl text-gray-700 mt-3">Your Feedback</h4>
      <textarea
        className="w-full border p-3 mt-2" rows={8}
        placeholder="Write your feedback here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      />
      <button className="w-full bg-gray-200 text-gray-700 p-2 mt-2" onClick={submitFeedback}>
        Submit Feedback
      </button>

      <h3 className="text-xl mt-4">Previous Feedback</h3>
      <ul>
        {userFeedback.map((fb) => (
          <li key={fb.id} className="border p-2 mt-2 flex justify-between items-center">
            {editingId === fb.id ? (
              <div className="w-full">
                <textarea
                  className="w-full border p-1"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button className="bg-gray-200 text-gray-700 px-2 py-1 mt-1 rounded" onClick={() => updateFeedback(fb.id)}>
                  Save
                </button>
                <button className="bg-gray-200 text-gray-700 px-2 py-1 mt-1 ml-2 rounded" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{fb.content}</span>
                <button className="bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => editFeedback(fb.id, fb.content)}>
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feedback;
